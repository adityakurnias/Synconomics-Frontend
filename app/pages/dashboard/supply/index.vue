<template>
  <div class="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
    <div class="flex justify-between items-center shrink-0">
      <div>
        <h1 class="font-display text-4xl mb-2 text-syn-accent">Supply Network</h1>
        <p class="text-syn-muted">Jelajahi dan temukan peluang kerjasama bisnis di sekitar Anda.</p>
      </div>
      <div v-if="!isLoading" class="flex items-center gap-4 text-sm font-medium">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-emerald-400"></div>
          <span class="text-syn-cream">Bisnis Kamu</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-blue-500"></div>
          <span class="text-syn-cream">Bisnis Lain</span>
        </div>
        <div class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-syn-muted">
          {{ businesses.length }} Terdaftar
        </div>
      </div>
    </div>

    <!-- Map Container -->
    <div class="glass-card rounded-3xl border border-white/5 overflow-hidden flex-1 relative min-h-[500px]">
      <div v-if="isLoading" class="absolute inset-0 bg-syn-darker/80 backdrop-blur-sm z-20 flex items-center justify-center">
        <div class="w-10 h-10 border-4 border-syn-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <div v-if="error" class="absolute inset-0 bg-syn-darker/80 backdrop-blur-sm z-20 flex items-center justify-center p-8 text-center text-red-400">
        {{ error }}
      </div>

      <div id="map" class="w-full h-full z-10 bg-[#1e1e1e]"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from 'vue';
import { useSupplyNetwork } from '~/composables/useSupplyNetwork';
import { useAuth } from '~/composables/useAuth';
import { useHead } from '#imports';

useHead({
  link: [
    { rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', integrity: 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=', crossorigin: '' }
  ],
  script: [
    { src: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', integrity: 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=', crossorigin: '' }
  ]
});

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
});

const { businesses, isLoading, error, fetchPublicBusinesses } = useSupplyNetwork();
const { user } = useAuth();

let map: any = null;
let markers: any[] = [];

const checkLeafletLoaded = (retries = 30) => {
  if (typeof window !== 'undefined' && (window as any).L) {
    initMap();
  } else if (retries > 0) {
    setTimeout(() => checkLeafletLoaded(retries - 1), 100);
  } else {
    console.error('Leaflet failed to load from CDN');
  }
};

onMounted(async () => {
  // Wait for the external script to finish loading and map div to mount
  checkLeafletLoaded();
  
  await fetchPublicBusinesses();
});

onBeforeUnmount(() => {
  if (map) {
    map.remove();
    map = null;
  }
});

const initMap = () => {
  if (typeof window === 'undefined') return;
  const L = (window as any).L;
  if (!L || map) return;

  // Default coordinate: Center of Indonesia roughly
  map = L.map('map').setView([-2.5489, 118.0149], 5);

  // Darker Map style for synconomics theme
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, © CARTO'
  }).addTo(map);

  plotMarkers();
};

watch(businesses, () => {
  if (map) {
    plotMarkers();
  }
});

const plotMarkers = () => {
  const L = (window as any).L;
  if (!L || !map) return;

  // Clear existing markers
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  let hasValidCoordinates = false;

  businesses.value.forEach(business => {
    if (business.latitude && business.longitude) {
      const lat = parseFloat(business.latitude as unknown as string);
      const lng = parseFloat(business.longitude as unknown as string);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        hasValidCoordinates = true;
        
        // Different colors based on ownership
        const isOwner = user.value && business.user_id === user.value.id;
        const markerColor = isOwner ? '#34d399' : '#3b82f6'; // Emerald for owner, Blue for others
        
        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: ${markerColor}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid #1a1a1a; box-shadow: 0 0 12px ${markerColor}; transition: all 0.3s;"></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        // Resolve logo URL
        const displayLogo = business.logo_url 
           ? (business.logo_url.startsWith('http') ? business.logo_url : `https://api-synconomics.synchronizeteams.com/${business.logo_url}`)
           : '';

        const whatsappLink = business.whatsapp ? `https://wa.me/${business.whatsapp.replace(/\\D/g, '').replace(/^0/, '62')}` : '';

        const popupContent = `
          <div style="font-family: 'Inter', sans-serif; color: #1e1e1e; min-width: 220px; max-width: 280px;">
            ${displayLogo ? `<div style="width:100%; height:80px; background-image:url('${displayLogo}'); background-size:cover; background-position:center; border-radius:8px; margin-bottom: 12px;"></div>` : ''}
            <div style="font-weight: 700; font-size: 16px; margin-bottom: 4px;">${business.name}</div>
            <div style="font-size: 11px; color: #666; margin-bottom: 8px; font-weight: 600; text-transform: uppercase;">${business.category}</div>
            <p style="font-size: 13px; margin: 0 0 12px 0; line-height: 1.5; color: #444;">${business.description ? (business.description.length > 100 ? business.description.substring(0, 100) + '...' : business.description) : 'Tidak ada deskripsi.'}</p>
            
            <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 12px; border-top: 1px solid #eee; padding-top: 12px;">
              ${business.phone ? `<div style="font-size: 12px; display: flex; align-items: center; gap: 6px;">📞 ${business.phone}</div>` : ''}
              ${business.address ? `<div style="font-size: 12px; display: flex; align-items: flex-start; gap: 6px;">📍 ${business.address}</div>` : ''}
              ${whatsappLink ? `<a href="${whatsappLink}" target="_blank" style="display: inline-block; background: #10b981; color: white; border-radius: 6px; padding: 6px 12px; font-size: 12px; text-decoration: none; text-align: center; margin-top: 4px; font-weight: 500;">Chat WhatsApp</a>` : ''}
            </div>
            ${isOwner ? `<div style="background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 4px; padding: 4px 8px; font-size: 11px; display: inline-block; margin-top: 12px; font-weight: 600;">Bisnis Kamu</div>` : ''}
          </div>
        `;

        const marker = L.marker([lat, lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(popupContent);
        
        markers.push(marker);
      }
    }
  });

  // Fit bounds to show all markers if there are any
  if (markers.length > 0) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 15 });
  }
};
</script>

<style>
/* Leaflet dark theme adjustments for popups */
.leaflet-popup-content-wrapper {
  background: #ffffff !important;
  border-radius: 16px !important;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
}
.leaflet-popup-tip {
  background: #ffffff !important;
}
.leaflet-popup-content {
  margin: 16px !important;
}
.leaflet-container {
  font-family: 'Inter', sans-serif !important;
}
</style>
