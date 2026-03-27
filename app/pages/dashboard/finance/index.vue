<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-start bg-syn-darker border border-white/5 p-6 rounded-3xl relative overflow-hidden">
      <div class="absolute inset-0 bg-linear-to-r from-syn-accent/5 to-transparent pointer-events-none"></div>
      <div class="relative z-10">
        <h1 class="text-3xl font-serif text-white mb-2 tracking-tight">Financial Management</h1>
        <p class="text-syn-muted text-[15px]">Monitor and manage the financial health of your business.</p>
      </div>
    </div>

    <!-- Business Not Found Alert -->
    <div v-if="!activeBusinessId && !businessesLoading" class="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
      <div class="flex items-center gap-3">
        <Icon name="heroicons:exclamation-triangle" class="w-6 h-6 text-red-500" />
        <span class="text-red-400 font-medium">Please create or select a business profile to manage your finances.</span>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="activeBusinessId" class="space-y-6">
      <!-- Tab System -->
      <div class="flex bg-white/5 p-1 rounded-2xl border border-white/10 w-full md:w-auto overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap',
            activeTab === tab.id ? 'bg-syn-accent text-syn-dark shadow-lg shadow-syn-accent/20' : 'text-syn-muted hover:text-white hover:bg-white/5'
          ]"
        >
          <Icon :name="tab.icon" class="w-4 h-4" />
          {{ tab.name }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="min-h-125">
        <!-- Summary -->
        <div v-if="activeTab === 'summary'">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <DashboardStatCard
              title="Total Income"
              :value="formatCurrency(currentMonthRevenue)"
              :trend="totalRevenueTrend"
              icon="heroicons:arrow-trending-up"
              iconColor="success"
            />
            <DashboardStatCard
              title="Total Expenditures"
              :value="formatCurrency(currentMonthCost)"
              :trend="totalCostTrend"
              icon="heroicons:arrow-trending-down"
              iconColor="danger"
              :invertTrend="true"
            />
            <DashboardStatCard
              title="Net Profit"
              :value="formatCurrency(currentMonthNetProfit)"
              :trend="netProfitTrend"
              icon="heroicons:banknotes"
              iconColor="accent"
            />
          </div>
        </div>

        <!-- POS System -->
        <div v-if="activeTab === 'pos'" class="h-full">
          <DashboardFinancePOSSystem :business-id="activeBusinessId" />
        </div>

        <!-- Transaction History -->
        <div v-if="activeTab === 'history'">
          <DashboardFinanceTransactionList :business-id="activeBusinessId" />
        </div>

        <!-- Expense Management -->
        <div v-if="activeTab === 'expenses'">
          <DashboardFinanceExpenseManagement :business-id="activeBusinessId" @expenseSaved="fetchDataForBusiness" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useBusiness } from '~/composables/useBusiness';
import { useExpense } from '~/composables/useExpense';
import { useTransaction } from '~/composables/useTransaction';

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
});

const { businesses, isLoading: businessesLoading, fetchBusinesses } = useBusiness();
const { expenses, fetchExpenses } = useExpense();
const { transactions, fetchTransactions } = useTransaction();

const activeBusinessId = ref<number>(0);
const activeTab = ref('summary');

const tabs = [
  { id: 'summary', name: 'Summary', icon: 'heroicons:chart-pie' },
  { id: 'pos', name: 'POS (Cashier)', icon: 'heroicons:shopping-cart' },
  { id: 'history', name: 'Transaction History', icon: 'heroicons:clock' },
  { id: 'expenses', name: 'Expense Management', icon: 'heroicons:document-minus' },
];

const fetchDataForBusiness = async () => {
  if (activeBusinessId.value) {
    console.log('fetchDataForBusiness: Before fetch, expenses.value length:', expenses.value.length);
    await Promise.all([
      fetchExpenses(activeBusinessId.value),
      fetchTransactions(activeBusinessId.value)
    ]);
    console.log('fetchDataForBusiness: After fetch, expenses.value length:', expenses.value.length);
  }
};

onMounted(async () => {
  await fetchBusinesses();
  const firstBusiness = businesses.value?.[0];
  if (firstBusiness) {
    activeBusinessId.value = firstBusiness.id;
    await fetchDataForBusiness();
  }
});

// Watch for activeTab changes and refetch data
watch(activeTab, async (newTab) => {
  console.log('activeTab changed to:', newTab);
  if (newTab !== 'pos') {
    await fetchDataForBusiness();
  }
});

const handleBusinessChange = async () => {
  console.log('activeBusinessId changed to:', activeBusinessId.value);
  await fetchDataForBusiness();
};

// Helper to check if a date is in the current month
const isCurrentMonth = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const result = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  // console.log(`isCurrentMonth(${dateString}): ${result}`); // Debugging date filtering
  return result;
};

// Helper to check if a date is in the previous month
const isPreviousMonth = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const result = date.getMonth() === prevMonth.getMonth() && date.getFullYear() === prevMonth.getFullYear();
  // console.log(`isPreviousMonth(${dateString}): ${result}`); // Debugging date filtering
  return result;
};

// Filter transactions and expenses for current and previous month
const currentMonthTransactions = computed(() => {
  const filtered = transactions.value.filter(t => isCurrentMonth(t.transaction_date || t.created_at || ''));
  console.log('currentMonthTransactions computed:', filtered.length, 'items'); // Debugging computed
  return filtered;
});
const previousMonthTransactions = computed(() => {
  const filtered = transactions.value.filter(t => isPreviousMonth(t.transaction_date || t.created_at || ''));
  // console.log('previousMonthTransactions computed:', filtered.length, 'items'); // Debugging computed
  return filtered;
});

const currentMonthExpenses = computed(() => {
  const filtered = expenses.value.filter(e => isCurrentMonth(e.created_at || ''));
  console.log('currentMonthExpenses computed:', filtered.length, 'items'); // Debugging computed
  return filtered;
});
const previousMonthExpenses = computed(() => {
  const filtered = expenses.value.filter(e => isPreviousMonth(e.created_at || ''));
  // console.log('previousMonthExpenses computed:', filtered.length, 'items'); // Debugging computed
  return filtered;
});

// Calculate metrics for current month
const currentMonthRevenue = computed(() => {
  const revenue = currentMonthTransactions.value.reduce((sum, t) => sum + Number(t.total_amount), 0);
  console.log('currentMonthRevenue computed:', revenue); // Debugging computed
  return revenue;
});
const currentMonthCost = computed(() => {
  const cost = currentMonthExpenses.value.reduce((sum, e) => sum + Number(e.amount), 0);
  console.log('currentMonthCost computed:aaa', currentMonthCost.value); // Debugging computed  
  return cost;
});
const currentMonthNetProfit = computed(() => {
  const netProfit = currentMonthRevenue.value - currentMonthCost.value;
  console.log('currentMonthNetProfit computed:', netProfit); // Debugging computed
  return netProfit;
});

// Calculate metrics for previous month
const previousMonthRevenue = computed(() => {
  const revenue = previousMonthTransactions.value.reduce((sum, t) => sum + Number(t.total_amount), 0);
  // console.log('previousMonthRevenue computed:', revenue); // Debugging computed
  return revenue;
});
const previousMonthCost = computed(() => {
  const cost = previousMonthExpenses.value.reduce((sum, e) => sum + Number(e.amount), 0);
  // console.log('previousMonthCost computed:', cost); // Debugging computed
  return cost;
});
const previousMonthNetProfit = computed(() => {
  const netProfit = previousMonthRevenue.value - previousMonthCost.value;
  // console.log('previousMonthNetProfit computed:', netProfit); // Debugging computed
  return netProfit;
});

// Helper to calculate trend percentage
const calculateTrend = (currentValue: number, previousValue: number): number => {
  if (previousValue === 0) {
    if (currentValue > 0) return 100;
    if (currentValue < 0) return -100;
    return 0;
  }
  return ((currentValue - previousValue) / previousValue) * 100;
};

// Calculate trends
const totalRevenueTrend = computed(() => 
  calculateTrend(currentMonthRevenue.value, previousMonthRevenue.value)
);
const totalCostTrend = computed(() => 
  calculateTrend(currentMonthCost.value, previousMonthCost.value)
);
const netProfitTrend = computed(() => 
  calculateTrend(currentMonthNetProfit.value, previousMonthNetProfit.value)
);

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Add a watch for expenses.value to see if it changes
watch(expenses, (newExpenses) => {
  console.log('expenses.value updated:', newExpenses.length, 'items');
}, { deep: true });

// Add a watch for currentMonthExpenses to see if it changes
watch(currentMonthExpenses, (newVal) => {
  console.log('currentMonthExpenses computed updated:', newVal.length, 'items');
});

watch(currentMonthCost, (newVal) => {
  console.log('currentMonthCost computed updated:', newVal);
});

watch(currentMonthNetProfit, (newVal) => {
  console.log('currentMonthNetProfit computed updated:', newVal);
});
</script>