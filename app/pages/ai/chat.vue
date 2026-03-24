<template>
  <div class="h-[calc(100vh-140px)] flex flex-col max-w-4xl mx-auto space-y-4">
    <div class="flex justify-between items-center bg-syn-darker/50 p-4 rounded-2xl border border-white/5 relative z-10 backdrop-blur-md">
      <h1 class="font-display text-2xl">AI Business Mentor</h1>
      <div class="flex gap-2">
        <select v-model="selectedRole" class="bg-syn-darker border border-white/10 rounded-full px-4 py-2 text-sm focus:border-syn-accent outline-none">
          <option value="session">Chat Biasa (Session)</option>
          <option value="idea">Idea Generation</option>
          <option value="strategy">Business Strategy</option>
          <option value="validation">Business Validation</option>
        </select>
        <button 
          v-if="currentSessionId && !isLoading && !sessionResult"
          @click="closeAndGetResult" 
          class="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors rounded-full text-sm">
          Akhiri Sesi
        </button>
        <button 
          v-if="selectedRole === 'session' && !currentSessionId && !sessionResult"
          @click="startNewChat" 
          :disabled="isLoading"
          class="px-4 py-2 bg-syn-accent/20 text-syn-accent hover:bg-syn-accent hover:text-syn-dark transition-colors rounded-full text-sm">
          + New Session
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto space-y-4 mb-4 bg-syn-darker rounded-2xl p-6 border border-white/5 relative">
      <div v-if="messages.length === 0" class="h-full flex items-center justify-center text-center">
        <div>
          <div class="w-16 h-16 rounded-full bg-syn-accent/10 flex items-center justify-center mx-auto mb-4 text-syn-accent">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <h2 class="font-display text-xl mb-2">Mulai Konsultasi</h2>
          <p class="text-syn-muted text-sm max-w-sm mx-auto">
            Silakan pilih mode chat di atas dan mulai ketik pesan untuk berkonsultasi mengenai ide bisnis, strategi, atau validasi.
          </p>
        </div>
      </div>

      <!-- Session Result Block -->
      <div v-if="sessionResult" class="p-6 bg-syn-accent/10 border border-syn-accent/30 rounded-2xl mb-6 relative z-10">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-syn-accent/20 flex items-center justify-center text-syn-accent">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 class="font-display text-xl text-syn-accent">Resume Konsultasi</h3>
        </div>
        <p class="text-syn-cream/90 text-sm whitespace-pre-wrap leading-relaxed">{{ sessionResult.resume }}</p>
        <button @click="clearCurrentChat" class="mt-6 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-sm transition-colors inline-block">
          Tutup & Navigasi Awal
        </button>
      </div>

      <template v-else-if="messages.length > 0">
        <!-- Chat History -->
        <div v-for="msg in messages" :key="msg.id" 
             :class="msg.role === 'user' ? 'text-right' : 'text-left'">
          <div :class="[
            'inline-block p-4 rounded-2xl max-w-[80%] relative z-10',
            msg.role === 'user' 
              ? 'bg-syn-accent text-syn-dark rounded-tr-sm' 
              : 'bg-white/5 border border-white/10 text-syn-cream/90 rounded-tl-sm'
          ]">
            <p class="whitespace-pre-wrap text-sm leading-relaxed">{{ msg.content }}</p>
          </div>
        </div>
      </template>

      <!-- Loading State -->
      <div v-if="isLoading && messages.length > 0" class="text-left">
        <div class="p-4 rounded-2xl bg-white/5 border border-white/10 rounded-tl-sm relative z-10 flex gap-2 items-center">
          <span class="w-2 h-2 rounded-full bg-syn-accent animate-bounce"></span>
          <span class="w-2 h-2 rounded-full bg-syn-accent animate-bounce" style="animation-delay: 0.2s"></span>
          <span class="w-2 h-2 rounded-full bg-syn-accent animate-bounce" style="animation-delay: 0.4s"></span>
        </div>
      </div>
      
      <div v-if="error" class="text-center text-red-400 text-sm p-4 bg-red-400/10 rounded-xl relative z-10">
        {{ error }}
      </div>
    </div>

    <!-- Input Form -->
    <form v-if="!sessionResult" @submit.prevent="handleSend" class="flex gap-3">
      <input 
        v-model="promptInput" 
        type="text" 
        class="flex-1 bg-syn-darker border border-white/10 rounded-full px-6 py-4 focus:border-syn-accent outline-none text-syn-cream transition-colors"
        placeholder="Ketik ide bisnismu..."
        :disabled="isLoading"
      />
      <button 
        type="submit" 
        :disabled="isLoading || !promptInput.trim()"
        class="w-14 h-14 flex items-center justify-center rounded-full bg-syn-accent text-syn-dark hover:bg-white transition-colors duration-300 disabled:opacity-50 shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
        </svg>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useAI } from '~/composables/useAI';

definePageMeta({
  layout: 'dashboard'
});

const { isLoading, error, messages, currentSessionId, sessionResult, initSession, sendMessage, sendRoleBasedChat, closeAndGetResult, clearCurrentChat } = useAI();
const promptInput = ref('');
const selectedRole = ref<'session' | 'idea' | 'strategy' | 'validation'>('session');

const startNewChat = async () => {
  // Pass a default businessId since the API requires it, and map 'session' to 'idea_generation'
  const sessionType = typeof selectedRole.value === 'string' && selectedRole.value !== 'session' 
                      ? (selectedRole.value === 'idea' ? 'idea_generation' : selectedRole.value as 'strategy' | 'validation') 
                      : 'idea_generation';
  await initSession(1, sessionType);
};

const handleSend = async () => {
  if (!promptInput.value.trim()) return;
  const text = promptInput.value;
  promptInput.value = ''; // Reset input segera untuk UX yang responsif

  // Jika kita sudah berada dalam sebuah sesi aktif (apapun tipenya)
  // maka kita HARUS melanjutkan konsultasi di sesi itu
  if (currentSessionId.value) {
    await sendMessage(text);
    return;
  }

  // Jika belum ada sesi (sesi baru)
  if (selectedRole.value === 'session') {
    await startNewChat(); // membuat session kosong generic 
    await sendMessage(text);
  } else {
    // Idea, Strategy, Validation bypass session creation pertama kali
    // Mereka otomatis membuat session di backend
    await sendRoleBasedChat(1, selectedRole.value, text);
  }
};
</script>
