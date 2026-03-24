<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="font-display text-4xl mb-2 text-syn-accent">Business Profile</h1>
        <p class="text-syn-muted">Kelola profil usaha dan informasi bisnis Anda.</p>
      </div>
      <button 
        @click="openCreateModal"
        class="px-6 py-3 bg-syn-accent text-syn-dark rounded-full font-display font-medium hover:bg-white transition-colors">
        + Tambah Bisnis
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !businesses.length" class="flex justify-center items-center py-20">
      <div class="w-10 h-10 border-4 border-syn-accent border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 mb-6">
      {{ error }}
    </div>

    <!-- Empty State -->
    <div v-if="!isLoading && businesses.length === 0" class="text-center py-20 glass-card rounded-3xl">
      <div class="w-20 h-20 rounded-full bg-syn-accent/10 flex items-center justify-center mx-auto mb-6 text-syn-accent">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
      </div>
      <h3 class="font-display text-2xl mb-2">Belum Ada Bisnis</h3>
      <p class="text-syn-muted mb-6">Mulai dengan mendaftarkan profil bisnis pertama Anda.</p>
    </div>

    <!-- Business List -->
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="business in businesses" :key="business.id" class="glass-card p-6 rounded-3xl glow-border group relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-syn-accent/10 rounded-full blur-3xl group-hover:bg-syn-accent/20 transition-all"></div>
        
        <div class="flex items-start gap-4 mb-4 relative z-10">
          <div class="w-16 h-16 rounded-xl bg-white/5 overflow-hidden border border-white/10 shrink-0">
            <img v-if="business.logo_url" :src="business.logo_url" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-syn-muted">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L28 20M6 12a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
          </div>
          <div>
            <h3 class="font-display text-xl leading-tight mb-1 group-hover:text-syn-accent transition-colors">{{ business.name }}</h3>
            <span class="inline-block px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-syn-muted">
              {{ business.category }}
            </span>
          </div>
        </div>
        
        <p class="text-sm text-syn-cream/70 line-clamp-2 mb-4 relative z-10 h-10">
          {{ business.description }}
        </p>
        
        <div class="flex justify-between items-center pt-4 border-t border-white/10 relative z-10">
          <div class="text-xs text-syn-muted flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            {{ business.address || 'Alamat belum diatur' }}
          </div>
          <button @click="editBusiness(business)" class="p-2 text-syn-accent hover:bg-syn-accent/10 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Very basic modal implementation for demo -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="glass-card max-w-xl w-full p-8 rounded-3xl relative">
        <button @click="closeModal" class="absolute top-6 right-6 text-syn-muted hover:text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <h2 class="font-display text-2xl mb-6">{{ isEditMode ? 'Edit Bisnis' : 'Tambah Bisnis Baru' }}</h2>
        
        <form @submit.prevent="saveBusiness" class="space-y-4">
          <div>
            <label class="block text-sm text-syn-muted mb-1">Nama Bisnis</label>
            <input v-model="form.name" type="text" required class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-syn-accent outline-none">
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-syn-muted mb-1">Kategori</label>
              <select v-model="form.category" required class="w-full bg-syn-darker border border-white/10 rounded-xl px-4 py-2 focus:border-syn-accent outline-none">
                <option value="F&B">F&B</option>
                <option value="Retail">Retail</option>
                <option value="Jasa">Jasa</option>
                <option value="Teknologi">Teknologi</option>
                <option value="Manufaktur">Manufaktur</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-syn-muted mb-1">Telepon</label>
              <input v-model="form.phone" type="text" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-syn-accent outline-none">
            </div>
          </div>
          
          <div>
            <label class="block text-sm text-syn-muted mb-1">Deskripsi</label>
            <textarea v-model="form.description" rows="3" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-syn-accent outline-none"></textarea>
          </div>
          
          <div>
            <label class="block text-sm text-syn-muted mb-1">Logo Bisnis</label>
            <input @change="handleFileChange" type="file" accept="image/*" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-syn-accent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-syn-accent file:text-syn-dark hover:file:bg-white text-sm text-syn-muted">
          </div>

          <button type="submit" :disabled="isSaving" class="w-full py-3 mt-4 bg-syn-accent text-syn-dark rounded-xl font-display font-medium hover:bg-white transition-colors disabled:opacity-50">
            {{ isSaving ? 'Menyimpan...' : 'Simpan Bisnis' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBusiness } from '~/composables/useBusiness';
import type { Business } from '~/types/business.types';

definePageMeta({
  layout: 'dashboard'
});

const { businesses, isLoading, error, isSaving, fetchBusinesses, createBusiness, updateBusiness } = useBusiness();

const showModal = ref(false);
const isEditMode = ref(false);
const editingId = ref<number | null>(null);
const fileInput = ref<File | null>(null);

const form = ref({
  name: '',
  category: 'F&B',
  description: '',
  phone: ''
});

onMounted(() => {
  fetchBusinesses();
});

const openCreateModal = () => {
  isEditMode.value = false;
  editingId.value = null;
  form.value = { name: '', category: 'F&B', description: '', phone: '' };
  fileInput.value = null;
  showModal.value = true;
};

const editBusiness = (business: Business) => {
  isEditMode.value = true;
  editingId.value = business.id;
  form.value = {
    name: business.name,
    category: business.category,
    description: business.description,
    phone: business.phone
  };
  fileInput.value = null;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    fileInput.value = target.files[0] || null;
  }
};

const saveBusiness = async () => {
  const formData = new FormData();
  formData.append('name', form.value.name);
  formData.append('category', form.value.category);
  formData.append('description', form.value.description);
  formData.append('phone', form.value.phone);
  
  if (fileInput.value) {
    formData.append('logo_url', fileInput.value); // API expects logo_url as file param
  }

  try {
    if (isEditMode.value && editingId.value) {
      await updateBusiness(editingId.value, formData);
    } else {
      await createBusiness(formData);
    }
    closeModal();
  } catch (err) {
    console.error(err);
  }
};
</script>
