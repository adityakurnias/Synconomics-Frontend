<template>
  <div class="flex flex-col h-full gap-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
      <div>
        <h1 class="font-display text-4xl mb-2 text-syn-accent">Supply Network</h1>
        <p class="text-syn-muted">Jelajahi jaringan bisnis dan kelola supply chain Anda.</p>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="flex items-center gap-1 bg-white/5 rounded-2xl p-1.5 shrink-0 overflow-x-auto">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
          activeTab === tab.id 
            ? 'bg-syn-accent text-syn-dark shadow-lg shadow-syn-accent/20' 
            : 'text-syn-muted hover:text-white hover:bg-white/5'
        ]"
      >
        <span class="flex items-center gap-2">
          <span v-html="tab.icon"></span>
          {{ tab.label }}
        </span>
      </button>
    </div>

    <!-- Active Content -->
    <div class="flex-1 flex flex-col min-h-0">
      <!-- Network Map Tab -->
      <div v-show="activeTab === 'map'" class="glass-card rounded-3xl border border-white/5 overflow-hidden flex-1 relative min-h-[500px]">
        <div v-if="isLoadingNetwork" class="absolute inset-0 bg-syn-darker/80 backdrop-blur-sm z-20 flex items-center justify-center">
          <div class="w-10 h-10 border-4 border-syn-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div v-if="networkError" class="absolute inset-0 bg-red-500/20 z-20 flex items-center justify-center p-8 text-center">
          <p class="text-red-300">{{ networkError }}</p>
        </div>

        <div id="map" class="w-full h-full z-10 bg-[#1e1e1e]"></div>
      </div>

      <!-- Supply Requests Tab -->
      <div v-if="activeTab === 'requests'" class="flex-1 overflow-y-auto">
        <SupplyRequestList 
          :requests="myRequests"
          :businesses="networkBusinesses"
          :is-loading="isLoadingSupply"
          @create="openRequestModal()"
          @edit="openRequestModal($event)"
          @delete="handleDeleteRequest"
        />
      </div>

      <!-- Supply Offers Tab -->
      <div v-if="activeTab === 'offers'" class="flex-1 overflow-y-auto">
        <SupplyOfferList 
          :offers="myOffers"
          :businesses="networkBusinesses"
          :is-loading="isLoadingSupply"
          @create="openOfferModal()"
          @edit="openOfferModal($event)"
          @delete="handleDeleteOffer"
        />
      </div>

      <!-- Supply Matches Tab -->
      <div v-if="activeTab === 'matches'" class="flex-1 overflow-y-auto">
        <SupplyMatchList 
          :matches="supplyMatches"
          :requests="supplyRequests"
          :offers="supplyOffers"
          :businesses="networkBusinesses"
          :is-loading="isLoadingSupply"
          @create="showMatchModal = true"
          @accept="handleAcceptMatch"
          @reject="handleRejectMatch"
          @delete="handleDeleteMatch"
        />
      </div>
    </div>

    <!-- Modals -->
    <SupplyRequestModal 
      v-if="showRequestModal"
      :business-id="currentBusinessId!"
      :initial-data="editingRequest"
      :target-business-name="targetBusinessName"
      @close="closeRequestModal"
      @saved="onRequestSaved"
    />

    <SupplyOfferModal 
      v-if="showOfferModal"
      :business-id="currentBusinessId!"
      :initial-data="editingOffer"
      :target-business-name="targetBusinessName"
      @close="closeOfferModal"
      @saved="onOfferSaved"
    />

    <SupplyMatchModal 
      v-if="showMatchModal"
      :available-requests="supplyRequests.filter(r => r.status === 'open')"
      :available-offers="supplyOffers"
      @close="showMatchModal = false"
      @saved="onMatchSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { useSupplyNetwork } from '~/composables/useSupplyNetwork';
import { useAuth } from '~/composables/useAuth';
import { useBusiness } from '~/composables/useBusiness';
import { useHead } from '#imports';
import type { SupplyRequest, SupplyOffer } from '~/types/supply.types';

// Supply Components
import SupplyRequestList from '~/components/dashboard/supply/SupplyRequestList.vue';
import SupplyOfferList from '~/components/dashboard/supply/SupplyOfferList.vue';
import SupplyMatchList from '~/components/dashboard/supply/SupplyMatchList.vue';
import SupplyRequestModal from '~/components/dashboard/supply/SupplyRequestModal.vue';
import SupplyOfferModal from '~/components/dashboard/supply/SupplyOfferModal.vue';
import SupplyMatchModal from '~/components/dashboard/supply/SupplyMatchModal.vue';

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
      integrity: 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=',
      crossorigin: ''
    }
  ]
});

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
});

const { 
  businesses: networkBusinesses, isLoading: isLoadingNetwork, error: networkError, fetchPublicBusinesses,
  supplyRequests, supplyOffers, supplyMatches, isLoadingSupply,
  fetchSupplyRequests, fetchSupplyOffers, fetchSupplyMatches,
  deleteSupplyRequest, deleteSupplyOffer, deleteSupplyMatch, updateMatchStatus
} = useSupplyNetwork();

const { user } = useAuth();
const { currentBusiness, fetchBusinesses } = useBusiness();

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
    return;
  }
  if (retries > 0) {
    setTimeout(() => checkLeafletLoaded(retries - 1), 100);
  } else {
    console.error("Leaflet failed to load.");
  }
};

onMounted(async () => {
  checkLeafletLoaded();
  await fetchPublicBusinesses();
  await fetchBusinesses();

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
  
  map = L.map('map').setView([-6.2088, 106.8456], 10); // Center on Jakarta

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
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

  markers.forEach(marker => marker.remove());
  markers = [];

  networkBusinesses.value.forEach(business => {
    if (business.latitude && business.longitude) {
      const isOwner = business.user_id === user.value?.id;
      
      const iconHtml = `<div style="background-color: ${isOwner ? '#f59e0b' : '#4f46e5'}; border-radius: 50%; width: 24px; height: 24px; display: flex; justify-content: center; align-items: center; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5);"><span style="font-size: 14px;">${business.category === 'Restaurant' ? '🍽️' : '🏭'}</span></div>`;
      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-map-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      });

      const marker = L.marker([business.latitude, business.longitude], { icon: customIcon }).addTo(map);
      
      const displayLogo = business.logo_url || 'https://via.placeholder.com/150/1a1a1a/ffffff?text=No+Logo';
      
      const whatsappLink = business.whatsapp ? `https://wa.me/${business.whatsapp.replace(/\D/g, '').replace(/^0/, '62')}` : '';

      const supplyButtons = !isOwner ? `
        <div style="display: flex; gap: 6px; margin-top: 8px;">
          <button onclick="window.__supplyPopupRequestFromBusiness(${business.id}, '${business.name.replace(/'/g, "\'")}')" style="flex: 1; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; border-radius: 8px; padding: 8px 12px; font-size: 11px; cursor: pointer; font-weight: 600; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">📋 Request Supply</button>
          <button onclick="window.__supplyPopupOfferToBusiness(${business.id}, '${business.name.replace(/'/g, "\'")}')" style="flex: 1; background: linear-gradient(135deg, #059669, #10b981); color: white; border: none; border-radius: 8px; padding: 8px 12px; font-size: 11px; cursor: pointer; font-weight: 600; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">🏪 Offer Supply</button>
        </div>
      ` : '';

      const popupContent = `
        <div style="font-family: 'Inter', sans-serif; color: #1e1e1e; min-width: 220px; max-width: 280px;">
          ${displayLogo ? `<div style="width:100%; height:80px; background-image:url('${displayLogo}'); background-size:cover; background-position:center; border-radius:8px; margin-bottom: 12px;"></div>` : ''}
          <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 700;">${business.name}</h3>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280;">${business.category}</p>
          <div style="border-top: 1px solid #e5e7eb; padding-top: 8px; display: flex; flex-direction: column; gap: 4px;">
            ${business.address ? `<div style="font-size: 12px; display: flex; align-items: flex-start; gap: 6px;">📍 ${business.address}</div>` : ''}
            ${whatsappLink ? `<a href="${whatsappLink}" target="_blank" style="display: inline-block; background: #10b981; color: white; border-radius: 6px; padding: 6px 12px; font-size: 12px; text-decoration: none; text-align: center; margin-top: 4px; font-weight: 500;">Chat WhatsApp</a>` : ''}
          </div>
          ${supplyButtons}
          ${isOwner ? `<div style="background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 4px; padding: 4px 8px; font-size: 11px; display: inline-block; margin-top: 12px; font-weight: 600;">Bisnis Kamu</div>` : ''}
        </div>
      `;
      
      marker.bindPopup(popupContent);
      markers.push(marker);
    }
  });
};
</script>