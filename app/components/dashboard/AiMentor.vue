<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-syn-cream flex items-center gap-2">
        AI Mentor Advice
      </h2>
      <Icon name="heroicons:sparkles" class="w-5 h-5 text-syn-accent" />
    </div>

    <div class="bg-syn-dark border border-syn-border rounded-2xl flex-1 flex flex-col relative overflow-hidden group hover:border-syn-accent/20 transition-colors glow-border">
      <div class="absolute top-0 right-0 w-32 h-32 bg-syn-accent/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
      
      <div v-if="isLoading" class="p-6 flex-1 flex items-center justify-center text-syn-muted">
        Generating AI advice...
      </div>
      <div v-else-if="error" class="p-6 flex-1 flex items-center justify-center text-syn-danger">
        Error: {{ error }}
      </div>
      <div v-else-if="sessionResult && sessionResult.resume" class="p-6 flex-1 overflow-y-auto space-y-6">
        <!-- Advice Item -->
        <div>
          <p class="text-[10px] font-bold text-syn-gold tracking-wider uppercase mb-1.5">AI Summary</p>
          <h3 class="text-syn-cream font-semibold text-[15px] mb-2 leading-snug">Comprehensive Business Analysis</h3>
          <p class="text-sm text-syn-muted leading-relaxed">
            {{ sessionResult.resume }}
          </p>
        </div>
      </div>
      <div v-else class="p-6 flex-1 flex items-center justify-center text-syn-muted">
        No AI advice available. Click below to generate.
      </div>

      <div class="p-4 border-t border-syn-border bg-syn-darker/50 backdrop-blur-sm">
        <button 
          @click="generateAdvice" 
          :disabled="isLoading || !businessId"
          class="w-full bg-syn-accent hover:bg-syn-gold text-syn-darker font-bold text-sm py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Generating...' : 'Generate Full Audit' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useAI } from '~/composables/useAI';

const props = defineProps<{
  businessId: number | null;
}>();

const { isLoading, error, sessionResult, initSession, closeAndGetResult } = useAI();

const generateAdvice = async () => {
  if (!props.businessId) {
    console.error("Business ID is required to generate AI advice.");
    return;
  }
  // For simplicity, we'll initiate a new session and get a result.
  // In a real app, you might want to check for existing sessions or have a more complex flow.
  await initSession(props.businessId, 'strategy'); // Or 'idea_generation', 'validation'
  if (!error.value && useAI().currentSessionId.value) {
    await closeAndGetResult();
  }
};

onMounted(() => {
  if (props.businessId) {
    generateAdvice();
  }
});

watch(() => props.businessId, (newId) => {
  if (newId) {
    generateAdvice();
  }
});
</script>
