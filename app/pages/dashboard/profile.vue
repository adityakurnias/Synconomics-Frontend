<template>
  <div class="max-w-4xl mx-auto space-y-8 pb-12">
    <!-- Profile Header -->
    <div class="relative group">
      <div class="absolute -inset-1 bg-linear-to-r from-syn-accent/20 to-syn-gold/20 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      <div class="relative bg-syn-darker/50 border border-white/5 rounded-2xl p-8 backdrop-blur-md overflow-hidden">
        <div class="absolute top-0 right-0 p-8 opacity-5">
          <Icon name="heroicons:user-circle" class="w-32 h-32" />
        </div>
        
        <div class="flex flex-col md:flex-row items-center gap-8">
          <div class="relative">
            <div class="w-32 h-32 rounded-full overflow-hidden border-2 border-syn-accent/30 p-1 bg-syn-dark">
              <img :src="user?.google_id ? `https://ui-avatars.com/api/?name=${user.name}&background=10B981&color=fff&size=200` : 'https://i.pravatar.cc/150?img=11'" 
                   alt="Avatar" class="w-full h-full object-cover rounded-full" />
            </div>
          </div>
          
          <div class="md:text-left space-y-2">
            <h1 class="font-display text-3xl text-syn-cream">{{ user?.name || 'Loading...' }}</h1>
            <div class="flex flex-wrap justify-center md:justify-start gap-4">
              <div class="flex items-center gap-2 text-syn-muted text-sm">
                <Icon name="heroicons:envelope" class="w-4 h-4" />
                {{ user?.email }}
              </div>
              <div class="flex items-center gap-2 text-syn-muted text-sm">
                <Icon name="heroicons:briefcase" class="w-4 h-4" />
                {{ user?.role || 'Entrepreneur' }}
              </div>
              <div v-if="user?.google_id" class="flex items-center gap-2 px-3 py-1 bg-syn-accent/10 border border-syn-accent/20 rounded-full text-[10px] text-syn-accent font-bold uppercase tracking-wider">
                <Icon name="logos:google-icon" class="w-3 h-3" />
                Google Linked
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Edit Profile Card -->
      <div class="md:col-span-2 space-y-6">
        <div class="bg-syn-darker/50 border border-white/5 rounded-2xl p-8 backdrop-blur-md">
          <h3 class="font-display text-xl mb-6 flex items-center gap-2">
            <Icon name="heroicons:cog-6-tooth" class="w-5 h-5 text-syn-accent" />
            Pengaturan Profil
          </h3>
          
          <form @submit.prevent="handleUpdate" class="space-y-6">
            <div class="space-y-4">
              <div class="group">
                <label class="block text-xs font-semibold text-syn-muted mb-2 group-focus-within:text-syn-accent transition-colors uppercase tracking-widest">Nama Lengkap</label>
                <input v-model="form.name" type="text" placeholder="Masukkan nama" 
                       class="w-full bg-syn-dark border border-white/10 rounded-xl px-4 py-3 text-syn-cream outline-none focus:border-syn-accent/50 transition-all shadow-inner" />
              </div>
              
              <div class="group">
                <label class="block text-xs font-semibold text-syn-muted mb-2 group-focus-within:text-syn-accent transition-colors uppercase tracking-widest">Alamat Email</label>
                <input v-model="form.email" type="email" placeholder="email@example.com" 
                  class="w-full bg-syn-dark border border-white/10 rounded-xl px-4 py-3 text-syn-cream outline-none focus:border-syn-accent/50 transition-all shadow-inner" />
              </div>
            </div>

            <div v-if="message" :class="`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-syn-accent/10 text-syn-accent border border-syn-accent/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`">
              {{ message.text }}
            </div>

            <button type="submit" :disabled="isUpdating" 
              class="w-full py-4 bg-syn-accent text-syn-dark font-display font-bold rounded-xl hover:bg-white transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-syn-accent/10">
              <Icon v-if="isUpdating" name="svg-spinners:ring-resize" class="w-5 h-5" />
              Simpan Perubahan
            </button>
          </form>
        </div>

        <div class="bg-red-500/5 border border-red-500/10 rounded-2xl p-8 backdrop-blur-md">
          <h3 class="font-display text-xl mb-4 text-red-400">Zona Bahaya</h3>
          <p class="text-syn-muted text-sm mb-6">Tindakan ini permanen. Setelah Anda keluar, Anda harus masuk kembali untuk mengakses data Anda.</p>
          <button @click="Logout" class="px-6 py-3 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all font-semibold text-sm">
            Keluar dari Akun
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-syn-darker/50 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
          <h4 class="font-display text-lg mb-6">Ringkasan Akun</h4>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-syn-gold/20 flex items-center justify-center text-syn-gold">
                  <Icon name="heroicons:calendar" class="w-4 h-4" />
                </div>
                <span class="text-xs text-syn-muted">Bergabung sejak</span>
              </div>
              <span class="text-xs font-semibold text-syn-cream">{{ formatDate(user?.created_at) }}</span>
            </div>
            
            <div class="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-syn-accent/20 flex items-center justify-center text-syn-accent">
                  <Icon name="heroicons:status-online" class="w-4 h-4" />
                </div>
                <span class="text-xs text-syn-muted">Status Akun</span>
              </div>
              <span class="text-xs font-semibold text-syn-accent">Aktif</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

definePageMeta({
  layout: 'dashboard'
});

const { user, FetchProfile, UpdateProfile, Logout } = useAuth();

const form = ref({
  name: user.value?.name || '',
  email: user.value?.email || ''
});

const isUpdating = ref(false);
const message = ref<{ type: 'success' | 'error', text: string } | null>(null);

onMounted(async () => {
  if (!user.value) {
    await FetchProfile();
  }
});

// Sync form when user data loads
watch(() => user.value, (newUser) => {
  if (newUser) {
    if (!form.value.name) form.value.name = newUser.name;
    if (!form.value.email) form.value.email = newUser.email;
  }
}, { immediate: true });

const handleUpdate = async () => {
  isUpdating.value = true;
  message.value = null;
  try {
    await UpdateProfile({
      name: form.value.name,
      email: form.value.email
    });
    message.value = { type: 'success', text: 'Profil berhasil diperbarui!' };
  } catch (err: any) {
    message.value = { type: 'error', text: err.data?.message || 'Gagal memperbarui profil.' };
  } finally {
    isUpdating.value = false;
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Maret 2024';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
};
</script>
