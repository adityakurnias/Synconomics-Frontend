<template>
  <div class="space-y-8 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-syn-darker border border-white/5 p-6 rounded-3xl relative overflow-hidden gap-6">
      <div class="absolute inset-0 bg-linear-to-r from-syn-accent/5 to-transparent pointer-events-none"></div>
      <div class="relative z-10">
        <h1 class="text-3xl font-serif text-white mb-2 tracking-tight">Community Hub</h1>
        <p class="text-syn-muted text-[15px]">Connect with other businesses, ask for supplies, or establish local networks.</p>
      </div>
      <div class="relative z-10 w-full sm:w-auto">
        <button 
          @click="showModal = true; selectedThread = null; form = { title: '', content: '' }"
          class="w-full sm:w-auto px-5 py-3 bg-syn-accent/10 text-syn-accent border border-syn-accent/20 rounded-xl font-medium hover:bg-syn-accent hover:text-syn-dark transition-all flex justify-center items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          New Thread
        </button>
      </div>
    </div>

    <!-- Feed Content di sebut gini kan ya feed feed an -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      <!-- ini feed utamanya buar ga lupa -->
      <div class="lg:col-span-3 space-y-5">
        <div v-if="isLoading && !threads.length" class="py-20 flex justify-center">
          <div class="w-8 h-8 border-4 border-syn-accent border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div v-else-if="threads.length === 0" class="p-16 text-center glass-card rounded-3xl border border-white/5">
          <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-syn-muted">
             <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
          </div>
          <p class="text-syn-muted mb-2 font-medium">No threads yet</p>
          <p class="text-sm text-syn-cream/50 mb-4">Be the first to start a discussion in your area.</p>
          <button @click="showModal = true; selectedThread = null; form = { title: '', content: '' }" class="text-sm font-medium text-syn-accent hover:text-white transition-colors">
            Start a Thread
          </button>
        </div>

        <!-- Thread Cardsnya biar ga lupa -->
        <NuxtLink 
          v-for="thread in threads" 
          :key="thread.id"
          :to="`/dashboard/community/${thread.id}`"
          class="block glass-card p-6 rounded-3xl border border-white/5 hover:border-syn-accent/30 transition-all group relative overflow-hidden"
        >
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-syn-accent/0 group-hover:bg-syn-accent/10 rounded-full blur-3xl transition-all duration-500"></div>

          <div class="relative z-10 flex items-start gap-4">
            <div class="w-10 h-10 rounded-full bg-syn-darker border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
               <span class="text-syn-accent font-medium text-lg">{{ thread.user?.name?.charAt(0) || '?' }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-medium text-white text-sm">{{ thread.user?.name || 'Unknown User' }}</span>
                <span class="text-xs text-syn-muted">&bull;</span>
                <span class="text-xs text-syn-muted">{{ formatDate(thread.created_at) }}</span>
              </div>
              <h3 class="text-xl font-display text-white mb-2 group-hover:text-syn-accent transition-colors">{{ thread.title }}</h3>
              <p class="text-sm text-syn-cream/70 line-clamp-2 leading-relaxed mb-4">
                {{ thread.content }}
              </p>
              
              <div class="flex items-center gap-4 text-xs text-syn-muted">
                <div class="flex items-center gap-1.5 hover:text-syn-accent transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                  <span>Reply</span>
                </div>
                <!-- Inline edit action (Only for thread owner) -->
                <div v-if="user && thread.user_id === user.id" @click.prevent="openEditModal(thread)" class="flex items-center gap-1.5 hover:text-syn-accent transition-colors opacity-0 group-hover:opacity-100">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  <span>Edit</span>
                </div>
                <!-- Inline delete action -->
                <div v-if="user && thread.user_id === user.id" @click.prevent="handleDeleteThread(thread)" class="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  <span>Hapus</span>
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- sidebar kanan nya biar ga lupa -->
      <div class="space-y-6">
        <div class="glass-card p-6 rounded-3xl border border-white/5">
          <h3 class="font-medium text-white mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-syn-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Popular Tags
          </h3>
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1.5 bg-syn-darker border border-white/5 rounded-lg text-xs text-syn-muted hover:text-white cursor-pointer transition-colors">#Supplies</span>
            <span class="px-3 py-1.5 bg-syn-darker border border-white/5 rounded-lg text-xs text-syn-muted hover:text-white cursor-pointer transition-colors">#Networking</span>
            <span class="px-3 py-1.5 bg-syn-darker border border-white/5 rounded-lg text-xs text-syn-muted hover:text-white cursor-pointer transition-colors">#B2B</span>
            <span class="px-3 py-1.5 bg-syn-darker border border-white/5 rounded-lg text-xs text-syn-muted hover:text-white cursor-pointer transition-colors">#Inventory</span>
          </div>
        </div>

        <div class="glass-card p-6 rounded-3xl border border-white/5 bg-linear-to-b from-syn-accent/5 to-transparent">
          <h3 class="font-medium text-white mb-2">Local Radius Match</h3>
          <p class="text-xs text-syn-muted mb-4 leading-relaxed">Expand your business network by finding partners within a 5km radius directly through the community.</p>
          <button class="w-full py-2 bg-syn-darker border border-white/10 hover:border-syn-accent text-sm text-syn-cream rounded-xl transition-all">Scan Network</button>
        </div>
      </div>
    </div>

    <!-- ini modal buat , negbuat thresadnya -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="glass-card max-w-lg w-full p-8 rounded-3xl relative">
        <button @click="closeModal" class="absolute top-6 right-6 text-syn-muted hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <h2 class="font-display text-2xl mb-6 text-white tracking-tight">
          {{ selectedThread ? 'Edit Thread' : 'Post to Community' }}
        </h2>
        
        <form @submit.prevent="handleCreateThread" class="space-y-5">
          <div>
            <label class="block text-sm text-syn-muted mb-2 font-medium">Thread Title</label>
            <input 
              v-model="form.title" 
              placeholder="E.g., Looking for raw coffee beans supplier"
              type="text" 
              required 
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-syn-accent outline-none text-white placeholder-white/20 transition-colors"
            >
          </div>

          <div>
            <label class="block text-sm text-syn-muted mb-2 font-medium">Content</label>
            <textarea 
              v-model="form.content" 
              rows="5"
              placeholder="Explain your needs or share your advice..."
              required 
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-syn-accent outline-none text-white placeholder-white/20 transition-colors resize-none"
            ></textarea>
          </div>

          <button 
            type="submit" 
            :disabled="isSaving"
            class="w-full py-4 mt-6 bg-syn-accent text-syn-dark rounded-xl font-display font-medium hover:bg-white transition-colors disabled:opacity-50"
          >
            {{ isSaving ? 'Saving...' : (selectedThread ? 'Update Thread' : 'Create Thread') }}
          </button>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuth } from '~/composables/useAuth';

definePageMeta({
  layout: 'dashboard',
  middleware:'auth'
});

const { user } = useAuth();
const { threads, isLoading, isSaving, fetchThreads, createThread, updateThread, deleteThread } = useCommunity();

const showModal = ref(false);
const selectedThread = ref<any>(null);
const form = ref({
  title: '',
  content: ''
});

onMounted(() => {
  fetchThreads();
});

const openEditModal = (thread: any) => {
  selectedThread.value = thread;
  form.value = { title: thread.title, content: thread.content };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedThread.value = null;
  form.value = { title: '', content: '' };
};

const handleCreateThread = async () => {
  if (!form.value.title || !form.value.content) return;
  
  try {
    if (selectedThread.value) {
      await updateThread(selectedThread.value.id, {
        title: form.value.title,
        content: form.value.content
      });
    } else {
      await createThread({
        title: form.value.title,
        content: form.value.content
      });
      // Ambil ulang threads setelah create biar ngisi relasi usernamenya :)
      await fetchThreads();
    }
    closeModal();
  } catch (err) {
    console.error('Failed to create/update thread', err);
  }
};

const handleDeleteThread = async (thread: any) => {
  if (confirm(`Yakin ingin menghapus thread "${thread.title}"?`)) {
    try {
      await deleteThread(thread.id);
    } catch (e) {
      console.error(e);
    }
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date);
};
</script>
