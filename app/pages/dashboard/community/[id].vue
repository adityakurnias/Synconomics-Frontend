<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Back button -->
    <NuxtLink to="/dashboard/community" class="inline-flex items-center gap-2 text-sm text-syn-muted hover:text-syn-accent transition-colors font-medium">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      Back to Community
    </NuxtLink>

    <div v-if="isLoading && !currentThread" class="py-20 flex justify-center">
      <div class="w-8 h-8 border-4 border-syn-accent border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Main Thread -->
    <div v-else-if="currentThread" class="glass-card rounded-3xl border border-white/5 overflow-hidden">
      <!-- Author info -->
      <div class="p-6 sm:p-8 flex items-start gap-4 border-b border-white/5 bg-white/2 relative">
        <div class="w-12 h-12 rounded-full bg-syn-darker border border-white/10 flex items-center justify-center shrink-0">
          <span class="text-syn-accent font-medium text-xl">{{ currentThread.user?.name?.charAt(0) || '?' }}</span>
        </div>
        <div class="flex-1 mt-1">
          <div class="flex items-center justify-between">
            <h2 class="font-medium text-white text-lg">{{ currentThread.user?.name || 'Unknown User' }}</h2>
            <div class="flex items-center gap-4">
              <span class="text-sm text-syn-muted">{{ formatDate(currentThread.created_at) }}</span>
              <button v-if="user && currentThread.user_id === user.id" @click.prevent="handleDeleteThreadDetail" class="text-xs text-red-400 hover:text-red-300 transition-colors bg-red-400/10 hover:bg-red-400/20 px-3 py-1.5 rounded-lg border border-red-400/20 font-medium">Hapus Thread</button>
            </div>
          </div>
          <p class="text-sm text-syn-muted">{{ currentThread.user?.email || 'No contact info' }}</p>
        </div>
      </div>

      <!-- Thread Content -->
      <div class="p-6 sm:p-8">
        <h1 class="font-display text-2xl sm:text-3xl text-white mb-6 leading-tight">{{ currentThread.title }}</h1>
        <div class="prose prose-invert max-w-none text-syn-cream/80 leading-relaxed">
          {{ currentThread.content }}
        </div>
      </div>
    </div>

    <!-- Replies Section -->
    <div v-if="currentThread" class="pt-4">
      <h3 class="font-medium text-white mb-6 flex items-center gap-2">
        <svg class="w-5 h-5 text-syn-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
        {{ replies.length }} Replies
      </h3>

      <div class="space-y-4 mb-8">
        <div 
          v-for="reply in sortedReplies" 
          :key="reply.id"
          class="glass-card p-6 rounded-2xl border border-white/5 flex gap-4"
        >
          <div class="w-10 h-10 rounded-full bg-syn-darker border border-white/10 flex items-center justify-center shrink-0">
            <span class="text-syn-accent font-medium text-sm">{{ reply.user?.name?.charAt(0) || '?' }}</span>
          </div>
          <div class="flex-1 min-w-0 group/reply relative">
            <div class="flex items-center gap-2 mb-2">
              <span class="font-medium text-white text-sm">{{ reply.user?.name || 'Unknown User' }}</span>
              <span class="text-xs text-syn-muted">&bull;</span>
              <span class="text-xs text-syn-muted">{{ formatDate(reply.created_at) }}</span>
            </div>
            
            <div v-if="editingReplyId === reply.id" class="mt-2 text-sm">
              <textarea 
                v-model="editingContent"
                rows="2"
                class="w-full bg-syn-darker border border-white/10 rounded-xl px-3 py-2 focus:border-syn-accent outline-none text-white resize-none"
              ></textarea>
              <div class="flex gap-2 mt-2">
                <button @click="submitEditReply(reply.id)" class="px-3 py-1 bg-syn-accent text-syn-dark rounded-md font-medium text-xs">Save</button>
                <button @click="editingReplyId = null" class="px-3 py-1 bg-white/5 text-syn-muted rounded-md font-medium text-xs">Cancel</button>
              </div>
            </div>
            <p v-else class="text-sm text-syn-cream/80 leading-relaxed font-sans">{{ reply.content }}</p>

            <div v-if="editingReplyId !== reply.id && user && reply.user_id === user.id" class="absolute top-0 right-0 opacity-0 group-hover/reply:opacity-100 transition-opacity flex gap-2">
              <button @click="startEditingReply(reply)" class="text-xs text-syn-muted hover:text-syn-accent">Edit</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Reply Input -->
      <div class="glass-card p-6 rounded-3xl border border-syn-accent/20 bg-linear-to-b from-syn-accent/5 to-transparent">
        <form @submit.prevent="handleReply" class="flex flex-col sm:flex-row gap-4">
          <textarea 
            v-model="replyContent"
            rows="2"
            placeholder="Write a reply..."
            required
            class="flex-1 bg-syn-darker border border-white/10 rounded-xl px-4 py-3 focus:border-syn-accent outline-none text-white placeholder-white/20 transition-colors resize-none text-sm"
          ></textarea>
          <button 
            type="submit"
            :disabled="isSaving"
            class="px-6 py-3 shrink-0 bg-syn-accent text-syn-dark rounded-xl font-display font-medium hover:bg-white transition-colors disabled:opacity-50 h-fit self-end"
          >
            {{ isSaving ? 'Sending...' : 'Post Reply' }}
          </button>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAuth } from '~/composables/useAuth';

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
});

const route = useRoute();
const router = useRouter();
const { user } = useAuth();
const threadId = computed(() => Number(route.params.id));

const { 
  currentThread, replies, 
  isLoading, isSaving, 
  fetchThreadById, fetchReplies, createReply, updateReply, deleteThread
} = useCommunity();

const replyContent = ref('');
const editingReplyId = ref<number | null>(null);
const editingContent = ref('');

onMounted(async () => {
  if (threadId.value) {
    await fetchThreadById(threadId.value);
    await fetchReplies(threadId.value);
  }
});

const sortedReplies = computed(() => {
  return [...replies.value].sort((a, b) => {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
});

const handleReply = async () => {
  if (!replyContent.value.trim() || !threadId.value) return;
  
  try {
    await createReply({
      thread_id: threadId.value,
      content: replyContent.value
    });
    replyContent.value = '';
    // Ambil ulang threads setelah create biar ngisi relasi usernamenya :)
    await fetchReplies(threadId.value);
  } catch (err) {
    console.error('Failed to post reply', err);
  }
};

const handleDeleteThreadDetail = async () => {
  if (confirm(`Yakin ingin menghapus thread "${currentThread.value?.title}"?`)) {
    try {
      if (threadId.value) {
         await deleteThread(threadId.value);
         router.push('/dashboard/community');
      }
    } catch (e) {
      console.error(e);
    }
  }
};

const startEditingReply = (reply: any) => {
  editingReplyId.value = reply.id;
  editingContent.value = reply.content;
};

const submitEditReply = async (id: number) => {
  if (!editingContent.value.trim()) return;
  try {
    await updateReply(id, { content: editingContent.value });
    editingReplyId.value = null;
  } catch (err) {
    console.error('Failed to update reply', err);
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
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
};
</script>
