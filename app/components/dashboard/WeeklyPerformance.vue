<template>
  <div class="bg-syn-dark border border-syn-border rounded-2xl p-5 hover:border-syn-accent/20 transition-colors glow-border">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-sm font-semibold text-syn-cream">Weekly Performance</h3>
      <button class="text-syn-muted hover:text-syn-accent transition-colors">
        <Icon name="heroicons:ellipsis-horizontal" class="w-5 h-5" />
      </button>
    </div>

    <div v-if="isLoadingMetrics" class="h-32 flex items-center justify-center text-syn-muted">
      Loading performance data...
    </div>
    <div v-else-if="weeklyPerformanceData.length === 0" class="h-32 flex items-center justify-center text-syn-muted">
      No performance data available.
    </div>
    <div v-else class="h-32 flex items-end justify-between gap-2 mt-auto">
      <div 
        v-for="(data, index) in weeklyPerformanceData" 
        :key="index" 
        class="w-full bg-syn-surface rounded-t-sm hover:bg-syn-accent/50 transition-colors cursor-pointer relative group" 
        :style="{ height: `${(data.value / maxPerformanceValue) * 100}%` }"
      >
        <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-syn-darker text-syn-cream border border-syn-accent/20 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
          {{ data.label }}: {{ formatCurrency(data.value) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue';
import { useBusiness } from '~/composables/useBusiness';

const props = defineProps<{
  businessId: number | null;
}>();

const { metrics, isLoading: isLoadingMetrics, fetchMetrics } = useBusiness();

// Fetch metrics when component mounts or businessId changes
onMounted(() => {
  if (props.businessId) {
    fetchMetrics();
  }
});

watch(() => props.businessId, (newId) => {
  if (newId) {
    fetchMetrics();
  }
});

const weeklyPerformanceData = computed(() => {
  if (!metrics.value || metrics.value.length === 0) {
    return [];
  }

  // Sort metrics by period_end or created_at to ensure correct order
  const sortedMetrics = [...metrics.value].sort((a, b) => {
    return new Date(a.period_end).getTime() - new Date(b.period_end).getTime();
  });

  // Take the last 7 metrics to represent "weekly" performance (assuming monthly data for now)
  // If actual weekly data is available, this logic would need to change.
  const lastSevenMetrics = sortedMetrics.slice(-7);

  return lastSevenMetrics.map(metric => ({
    label: metric.period, // e.g., "03-2026"
    value: metric.net_profit // Using net_profit as the performance indicator
  }));
});

const maxPerformanceValue = computed(() => {
  if (weeklyPerformanceData.value.length === 0) {
    return 1; // Avoid division by zero
  }
  return Math.max(...weeklyPerformanceData.value.map(data => data.value));
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0, // No cents for bar chart labels
    maximumFractionDigits: 0
  }).format(value);
};
</script>
