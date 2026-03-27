<template>
  <div class="max-w-4xl mx-auto space-y-8 pb-20">
    <div class="flex items-center gap-4">
      <NuxtLink to="/dashboard" class="p-2 rounded-xl bg-syn-dark border border-syn-border hover:border-syn-accent/40 transition-colors group">
        <Icon name="heroicons:arrow-left" class="w-5 h-5 text-syn-muted group-hover:text-syn-accent" />
      </NuxtLink>
      <div>
        <h1 class="text-3xl font-serif text-syn-cream tracking-tight">Audit Bisnis Komprehensif</h1>
        <p class="text-syn-muted text-sm mt-1">Analisis mendalam berbasis AI untuk pertumbuhan bisnis Anda.</p>
      </div>
    </div>

    <div class="bg-syn-dark border border-syn-border rounded-3xl overflow-hidden glass-card relative min-h-[400px]">
       <div class="absolute top-0 right-0 w-64 h-64 bg-syn-accent/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

       <div v-if="isLoading" class="p-20 flex flex-col items-center justify-center text-syn-muted gap-4">
         <Icon name="heroicons:sparkles" class="w-10 h-10 text-syn-accent animate-pulse" />
         <p class="text-lg">AI sedang melakukan audit mendalam...</p>
         <p class="text-xs opacity-60">Mohon tunggu, ini mungkin memakan waktu beberapa detik.</p>
       </div>

       <div v-else-if="error" class="p-20 flex flex-col items-center justify-center text-syn-danger text-center gap-4">
         <Icon name="heroicons:exclamation-triangle" class="w-10 h-10" />
         <div class="space-y-2">
           <h3 class="text-xl font-bold">Gagal Membuat Audit</h3>
           <p class="max-w-md">{{ error }}</p>
         </div>
         <button @click="fetchAudit" class="mt-4 px-6 py-2 bg-syn-accent text-syn-dark font-bold rounded-xl hover:bg-syn-gold transition-colors cursor-pointer">
            Coba Lagi
         </button>
       </div>

       <div v-else-if="auditResult" class="p-10 md:p-16">
          <div class="prose-audit-full max-w-none max-h-none" v-html="formattedAudit"></div>
       </div>

       <div v-else class="p-20 flex flex-col items-center justify-center text-syn-muted text-center gap-4">
         <p>Data audit tidak ditemukan.</p>
         <NuxtLink to="/dashboard" class="text-syn-accent hover:underline">Kembali ke Dashboard</NuxtLink>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAI } from '~/composables/useAI';
import { useRoute } from 'vue-router';

definePageMeta({
  layout: 'dashboard'
});

const route = useRoute();
const businessId = Number(route.params.id);

const { isLoading, error, auditResult, getAudit } = useAI();

const formattedAudit = computed(() => {
  if (!auditResult.value) return '';

  // Simple markdown-to-html formatter
  return auditResult.value
    .replace(/^# (.*)/gm, '<h1 class="text-2xl font-bold text-syn-cream mb-6 border-b border-syn-border pb-4 font-serif">$1</h1>')
    .replace(/^## (.*)/gm, '<h2 class="text-xl font-bold text-syn-cream mt-10 mb-5 font-serif">$1</h2>')
    .replace(/^### (.*)/gm, '<h3 class="text-lg font-bold text-syn-cream mt-8 mb-3">$1</h3>')
    .replace(/^\d+\.\s(.*)/gm, '<li class="text-[15px] text-syn-muted ml-6 mb-2 list-decimal">$1</li>')
    .replace(/^\-\s(.*)/gm, '<li class="text-[15px] text-syn-muted ml-6 mb-2 list-disc">$1</li>')
    .replace(/\*\*(.*)\*\*/g, '<strong class="text-syn-cream font-semibold">$1</strong>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n(?!<)/g, '<br/>');
});

const fetchAudit = () => {
  if (businessId) {
    getAudit(businessId);
  }
};

onMounted(() => {
  fetchAudit();
});
</script>

<style scoped>
.prose-audit-full :deep(h1) { color: var(--color-syn-cream); }
.prose-audit-full :deep(h2) { color: var(--color-syn-cream); }
.prose-audit-full :deep(h3) { color: var(--color-syn-cream); }
.prose-audit-full :deep(p) { margin-bottom: 1.5rem; line-height: 1.7; font-size: 15px; color: var(--color-syn-muted); }
.prose-audit-full :deep(strong) { color: var(--color-syn-cream); }
.prose-audit-full :deep(li) { margin-bottom: 0.5rem; line-height: 1.6; }
</style>
