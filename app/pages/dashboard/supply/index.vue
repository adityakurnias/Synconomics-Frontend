<template>
  <div class="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
      <div>
        <h1 class="font-display text-4xl mb-2 text-syn-accent">Jaringan Suplai</h1>
        <p class="text-syn-muted">Jelajahi jaringan bisnis di sekitar Anda.</p>
      </div>
    </div>

    <!-- Active Content -->
    <div class="flex-1 flex flex-col min-h-0">
      <!-- Network Map Tab -->
      <div v-show="activeTab === 'map'" class="glass-card rounded-3xl border border-white/5 overflow-hidden flex-1 relative min-h-[500px]">
        <div v-if="isLoadingNetwork" class="absolute inset-0 bg-syn-darker/80 backdrop-blur-sm z-20 flex items-center justify-center">
          <div class="w-10 h-10 border-4 border-syn-accent border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div v-if="networkError" class="absolute inset-0 bg-syn-darker/80 backdrop-blur-sm z-20 flex items-center justify-center p-8 text-center text-red-400">
          {{ networkError }}
        </div>

        <!-- Legend -->
        <div class="absolute top-4 right-4 z-11 flex flex-col gap-2 scale-90 origin-top-right">
          <div class="px-3 py-2 bg-syn-darker/90 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-3">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></div>
              <span class="text-[10px] font-bold text-white uppercase tracking-wider">Bisnis Kamu</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
              <span class="text-[10px] font-bold text-white uppercase tracking-wider">Bisnis Lain</span>
            </div>
          </div>
        </div>

        <div id="map" class="w-full h-full z-10 bg-[#1e1e1e]"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSupplyNetwork } from '~/composables/useSupplyNetwork';
import { useAuth } from '~/composables/useAuth';
import { useBusiness } from '~/composables/useBusiness';

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

const { businesses: networkBusinesses, isLoading: isLoadingNetwork, error: networkError, fetchPublicBusinesses } = useSupplyNetwork();
const { businesses: myBusinesses, fetchBusinesses } = useBusiness();

// Set of business IDs owned by the logged-in user
const myBusinessIds = computed(() => new Set(myBusinesses.value.map(b => b.id)));

// Removing redundant useAuth and useBusiness calls as they are merged above

const currentBusinessId = ref<number | null>(null);

// Tabs
const tabs = [
  { id: 'map', label: 'Network Map', icon: '🗺️' },
  { id: 'requests', label: 'My Requests', icon: '📋' },
  { id: 'offers', label: 'My Offers', icon: '🏪' },
  { id: 'matches', label: 'Matches', icon: '🤝' }
];
const activeTab = ref('map');

// Modal State
const showRequestModal = ref(false);
const showOfferModal = ref(false);
const showMatchModal = ref(false);
const editingRequest = ref<SupplyRequest | null>(null);
const editingOffer = ref<SupplyOffer | null>(null);
const targetBusinessName = ref<string | null>(null);

// Computed for "My" tabs
const myRequests = computed(() => {
  if (!currentBusinessId.value) return [];
  return supplyRequests.value.filter(r => r.business_id === currentBusinessId.value);
});

const myOffers = computed(() => {
  if (!currentBusinessId.value) return [];
  return supplyOffers.value.filter(o => o.business_id === currentBusinessId.value);
});

// Map
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
  checkLeafletLoaded();
  await fetchPublicBusinesses();
  await fetchBusinesses();
  console.log('[SupplyNetwork] My Businesses:', JSON.stringify(myBusinesses.value));

  // Fix currentBusinessId selection logic
  if (currentBusiness.value) {
    currentBusinessId.value = currentBusiness.value.id;
  } else {
    // Fallback: check useBusiness.businesses list
    const { businesses: userBusinesses } = useBusiness();
    if (userBusinesses.value && userBusinesses.value.length > 0) {
      const firstBiz = userBusinesses.value[0];
      if (firstBiz) currentBusinessId.value = firstBiz.id;
    } else {
      console.warn("No business profiling found for the user. Using default ID 1.");
      currentBusinessId.value = 1; // Default fallback to match Dashboard
    }
  }

  // Load ALL supply data for lookup and network view
  await Promise.all([
    fetchSupplyRequests(),
    fetchSupplyOffers(),
    fetchSupplyMatches()
  ]);
});

onBeforeUnmount(() => {
  if (map) {
    map.remove();
    map = null;
  }
});

// Watch tab changes to load data - fetch all to ensure lookups work
watch(activeTab, async () => {
  await Promise.all([
    fetchSupplyRequests(),
    fetchSupplyOffers(),
    fetchSupplyMatches()
  ]);
});

// Modal Handlers
const openRequestModal = (req?: SupplyRequest) => {
  editingRequest.value = req || null;
  showRequestModal.value = true;
};

const closeRequestModal = () => {
  showRequestModal.value = false;
  targetBusinessName.value = null;
};

const openOfferModal = (offer?: SupplyOffer) => {
  editingOffer.value = offer || null;
  showOfferModal.value = true;
};

const closeOfferModal = () => {
  showOfferModal.value = false;
  targetBusinessName.value = null;
};

const onRequestSaved = async () => {
  showRequestModal.value = false;
  editingRequest.value = null;
  targetBusinessName.value = null;
  await fetchSupplyRequests();
};

const onOfferSaved = async () => {
  showOfferModal.value = false;
  editingOffer.value = null;
  targetBusinessName.value = null;
  await fetchSupplyOffers();
};

const onMatchSaved = async () => {
  showMatchModal.value = false;
  await fetchSupplyMatches();
};

const handleDeleteRequest = async (id: number) => {
  if (!confirm('Hapus supply request ini?')) return;
  await deleteSupplyRequest(id);
};

const handleDeleteOffer = async (id: number) => {
  if (!confirm('Hapus supply offer ini?')) return;
  await deleteSupplyOffer(id);
};

const handleAcceptMatch = async (id: number) => {
  await updateMatchStatus(id, { status: 'accepted' });
};

const handleRejectMatch = async (id: number) => {
  await updateMatchStatus(id, { status: 'rejected' });
};

const handleDeleteMatch = async (id: number) => {
  if (!confirm('Hapus supply match ini?')) return;
  await deleteSupplyMatch(id);
};

// ── Map Functions ──
const initMap = () => {
  if (typeof window === 'undefined') return;
  const L = (window as any).L;
  if (!L || map) return;

  const mapEl = document.getElementById('map');
  if (!mapEl) return;

  map = L.map('map').setView([-2.5489, 118.0149], 5);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, © CARTO'
  }).addTo(map);

  plotMarkers();
};

watch(networkBusinesses, () => {
  if (map) {
    plotMarkers();
  }
});

// Make popup action handlers global so inline onclick works
if (typeof window !== 'undefined') {
  (window as any).__supplyPopupRequestFromBusiness = (businessId: number, businessName: string) => {
    targetBusinessName.value = businessName;
    editingRequest.value = null;
    activeTab.value = 'requests';
    showRequestModal.value = true;
  };
  (window as any).__supplyPopupOfferToBusiness = (businessId: number, businessName: string) => {
    targetBusinessName.value = businessName;
    editingOffer.value = null;
    activeTab.value = 'offers';
    showOfferModal.value = true;
  };
}

const plotMarkers = () => {
  const L = (window as any).L;
  if (!L || !map) return;

  markers.forEach(m => map.removeLayer(m));
  markers = [];

  networkBusinesses.value.forEach(business => {
    if (business.latitude && business.longitude) {
      const lat = parseFloat(business.latitude as unknown as string);
      const lng = parseFloat(business.longitude as unknown as string);

      if (!isNaN(lat) && !isNaN(lng)) {
        const isOwner = myBusinessIds.value.has(business.id);
        const markerColor = isOwner ? '#34d399' : '#3b82f6';

        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: ${markerColor}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid #1a1a1a; box-shadow: 0 0 12px ${markerColor}; transition: all 0.3s;"></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const displayLogo = business.logo_url
           ? (business.logo_url.startsWith('http') ? business.logo_url : `https://api-synconomics.synchronizeteams.com/${business.logo_url}`)
           : '';

        const whatsappLink = business.whatsapp ? `https://wa.me/${business.whatsapp.replace(/\D/g, '').replace(/^0/, '62')}` : '';

        const supplyButtons = !isOwner ? `
          <div style="display: flex; gap: 6px; margin-top: 8px;">
            <button onclick="window.__supplyPopupRequestFromBusiness(${business.id}, '${business.name.replace(/'/g, "\\'")}')" style="flex: 1; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; border-radius: 8px; padding: 8px 12px; font-size: 11px; cursor: pointer; font-weight: 600; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">📋 Request Supply</button>
            <button onclick="window.__supplyPopupOfferToBusiness(${business.id}, '${business.name.replace(/'/g, "\\'")}')" style="flex: 1; background: linear-gradient(135deg, #059669, #10b981); color: white; border: none; border-radius: 8px; padding: 8px 12px; font-size: 11px; cursor: pointer; font-weight: 600; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">🏪 Offer Supply</button>
          </div>
        ` : '';

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
            ${supplyButtons}
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

  if (markers.length > 0) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 15 });
  }
};
</script>

<style>
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
