<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-serif text-syn-cream mb-2 tracking-tight">Business Health Overview</h1>
      <p class="text-syn-muted text-[15px]">Global performance metrics for the current fiscal quarter.</p>
    </div>

    <!-- Stats Grid -->
    <div v-if="isLoadingMetrics" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <DashboardStatCard title="Loading..." value="-" :trend="0" icon="heroicons:arrow-trending-up" iconColor="success" />
      <DashboardStatCard title="Loading..." value="-" :trend="0" icon="heroicons:banknotes" iconColor="danger" />
      <DashboardStatCard title="Loading..." value="-" :trend="0" icon="heroicons:cog" iconColor="warning" />
      <DashboardStatCard title="Loading..." value="-" :trend="0" icon="heroicons:building-library" iconColor="accent" />
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <DashboardStatCard 
        title="Total Revenue" 
        :value="formatCurrency(totalRevenue)" 
        :trend="totalRevenueTrend" 
        icon="heroicons:arrow-trending-up"
        iconColor="success"
      />
      <DashboardStatCard 
        title="Total Cost" 
        :value="formatCurrency(totalCost)" 
        :trend="totalCostTrend" 
        icon="heroicons:banknotes"
        iconColor="danger"
      />
      <DashboardStatCard 
        title="Operational Cost" 
        :value="formatCurrency(operationalCost)" 
        :trend="operationalCostTrend" 
        icon="heroicons:cog"
        iconColor="warning"
      />
      <DashboardStatCard 
        title="Net Profit" 
        :value="formatCurrency(netProfit)" 
        :trend="netProfitTrend" 
        icon="heroicons:building-library"
        iconColor="accent"
      />
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        <DashboardProductManagement :business-id="currentBusinessId" />
      </div>
      
      <div class="space-y-8 flex flex-col">
        <div class="flex-1">
          <DashboardAiMentor :business-id="currentBusinessId" />
        </div>
        <DashboardWeeklyPerformance :business-id="currentBusinessId" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useBusiness } from '~/composables/useBusiness';
import type { BusinessMetric, Business } from '~/types/business.types';

definePageMeta({
  layout: 'dashboard'
});

const { metrics, isLoading: isLoadingMetrics, fetchMetrics, currentBusiness, fetchBusinesses } = useBusiness();

const currentBusinessId = ref<number | null>(null);

onMounted(async () => {
  await fetchMetrics();
  await fetchBusinesses(); // Fetch businesses to populate currentBusiness

  if (currentBusiness.value) {
    currentBusinessId.value = currentBusiness.value.id;
  } else if (metrics.value.length > 0) {
    // Fallback: if currentBusiness is not set, try to get business_id from a metric
    currentBusinessId.value = metrics.value[0].business_id;
  } else {
    // Fallback: if no business or metrics, use a default or handle error
    console.warn("No current business or metrics found. Using a placeholder business ID (1) for product management.");
    currentBusinessId.value = 1; // Placeholder, ideally this should be handled by user selection or proper auth flow
  }
});

const latestMetric = computed<BusinessMetric | null>(() => {
  if (metrics.value && metrics.value.length > 0) {
    // Assuming the latest metric is the first one in the array if sorted by date desc
    // A more robust solution would sort by period_end or created_at.
    return metrics.value[0]; 
  }
  return null;
});

const previousMetric = computed<BusinessMetric | null>(() => {
  if (metrics.value && metrics.value.length > 1) {
    // Assuming the second latest metric is the second one in the array
    return metrics.value[1];
  }
  return null;
});

const calculateTrend = (currentValue: number, previousValue: number): number => {
  if (previousValue === 0) return 0; // Avoid division by zero
  return ((currentValue - previousValue) / previousValue) * 100;
};

const totalRevenue = computed(() => latestMetric.value?.revenue || 0);
const totalRevenueTrend = computed(() => {
  if (latestMetric.value && previousMetric.value) {
    return calculateTrend(latestMetric.value.revenue, previousMetric.value.revenue);
  }
  return 0;
});

const totalCost = computed(() => (latestMetric.value?.operational_cost || 0) + (latestMetric.value?.cogs || 0));
const totalCostTrend = computed(() => {
  if (latestMetric.value && previousMetric.value) {
    const currentTotalCost = (latestMetric.value.operational_cost || 0) + (latestMetric.value.cogs || 0);
    const previousTotalCost = (previousMetric.value.operational_cost || 0) + (previousMetric.value.cogs || 0);
    return calculateTrend(currentTotalCost, previousTotalCost);
  }
  return 0;
});

const operationalCost = computed(() => latestMetric.value?.operational_cost || 0);
const operationalCostTrend = computed(() => {
  if (latestMetric.value && previousMetric.value) {
    return calculateTrend(latestMetric.value.operational_cost, previousMetric.value.operational_cost);
  }
  return 0;
});

const netProfit = computed(() => latestMetric.value?.net_profit || 0);
const netProfitTrend = computed(() => {
  if (latestMetric.value && previousMetric.value) {
    return calculateTrend(latestMetric.value.net_profit, previousMetric.value.net_profit);
  }
  return 0;
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};
</script>