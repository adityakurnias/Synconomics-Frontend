<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-serif text-syn-cream mb-2 tracking-tight">Business Health Overview</h1>
      <p class="text-syn-muted text-[15px]">Global performance metrics for the current fiscal quarter.</p>
    </div>

    <!-- Stats Grid -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <DashboardStatCard title="Loading..." value="-" :trend="0" icon="heroicons:arrow-trending-up" iconColor="success" />
      <DashboardStatCard title="Loading..." value="-" :trend="0" icon="heroicons:banknotes" iconColor="danger" />
      <!-- <DashboardStatCard title="Loading..." value="-" :trend="0" icon="heroicons:cog" iconColor="warning" /> -->
      <DashboardStatCard title="Loading..." value="-" :trend="0" icon="heroicons:building-library" iconColor="accent" />
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <DashboardStatCard 
        title="Total Revenue" 
        :value="formatCurrency(currentMonthRevenue)" 
        :trend="totalRevenueTrend" 
        icon="heroicons:arrow-trending-up"
        iconColor="success"
      />
      <DashboardStatCard 
        title="Total Cost" 
        :value="formatCurrency(currentMonthCost)" 
        :trend="totalCostTrend" 
        icon="heroicons:banknotes"
        iconColor="danger"
        :invertTrend="true"
      />
      <!-- <DashboardStatCard 
        title="Operational Cost" 
        :value="formatCurrency(operationalCost)" 
        :trend="operationalCostTrend" 
        icon="heroicons:cog"
        iconColor="warning"
      /> -->
      <DashboardStatCard 
        title="Net Profit" 
        :value="formatCurrency(currentMonthNetProfit)" 
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
import { useBusiness } from '~/composables/useBusiness';
import { useExpense } from '~/composables/useExpense';
import { useTransaction } from '~/composables/useTransaction';

definePageMeta({
  layout: 'dashboard'
});

const { businesses, fetchBusinesses } = useBusiness();
const { expenses, fetchExpenses } = useExpense();
const { transactions, isLoading, fetchTransactions } = useTransaction();

const currentBusinessId = ref<number | null>(null);

onMounted(async () => {
  await fetchBusinesses();
  const firstBusiness = businesses.value?.[0];
  if (firstBusiness) {
    currentBusinessId.value = firstBusiness.id;
    await Promise.all([
      fetchExpenses(firstBusiness.id),
      fetchTransactions(firstBusiness.id)
    ]);
  }
});

// Helper to check if a date is in the current month
const isCurrentMonth = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

// Helper to check if a date is in the previous month
const isPreviousMonth = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return date.getMonth() === prevMonth.getMonth() && date.getFullYear() === prevMonth.getFullYear();
};

// Filter transactions and expenses for current and previous month
const currentMonthTransactions = computed(() =>
  transactions.value.filter(t => isCurrentMonth(t.transaction_date || t.created_at || ''))
);
const previousMonthTransactions = computed(() =>
  transactions.value.filter(t => isPreviousMonth(t.transaction_date || t.created_at || ''))
);
const currentMonthExpenses = computed(() =>
  expenses.value.filter(e => isCurrentMonth(e.created_at || ''))
);
const previousMonthExpenses = computed(() =>
  expenses.value.filter(e => isPreviousMonth(e.created_at || ''))
);

// Current month metrics
const currentMonthRevenue = computed(() =>
  currentMonthTransactions.value.reduce((sum, t) => sum + Number(t.total_amount), 0)
);
const currentMonthCost = computed(() =>
  currentMonthExpenses.value.reduce((sum, e) => sum + Number(e.amount), 0)
);
const currentMonthNetProfit = computed(() =>
  currentMonthRevenue.value - currentMonthCost.value
);

// Previous month metrics
const previousMonthRevenue = computed(() =>
  previousMonthTransactions.value.reduce((sum, t) => sum + Number(t.total_amount), 0)
);
const previousMonthCost = computed(() =>
  previousMonthExpenses.value.reduce((sum, e) => sum + Number(e.amount), 0)
);
const previousMonthNetProfit = computed(() =>
  previousMonthRevenue.value - previousMonthCost.value
);

// Trend calculation
const calculateTrend = (currentValue: number, previousValue: number): number => {
  if (previousValue === 0) {
    if (currentValue > 0) return 100;
    if (currentValue < 0) return -100;
    return 0;
  }
  return ((currentValue - previousValue) / previousValue) * 100;
};

const totalRevenueTrend = computed(() =>
  calculateTrend(currentMonthRevenue.value, previousMonthRevenue.value)
);
const totalCostTrend = computed(() =>
  calculateTrend(currentMonthCost.value, previousMonthCost.value)
);
const netProfitTrend = computed(() =>
  calculateTrend(currentMonthNetProfit.value, previousMonthNetProfit.value)
);

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};
</script>