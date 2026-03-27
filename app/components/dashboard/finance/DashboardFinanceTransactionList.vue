<template>
  <div class="flex flex-col space-y-6 h-full">
    <div class="flex items-center justify-between">
      <h3 class="text-xl font-display text-white">Transaction History</h3>
      <div class="flex gap-2">
        <div class="relative">
          <select v-model="filterStatus" class="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-syn-accent appearance-none pr-10">
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Icon name="heroicons:chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-syn-muted pointer-events-none" />
        </div>
        <button @click="fetchTransactions(businessId)" class="p-2 bg-white/5 border border-white/10 rounded-xl text-syn-muted hover:text-white transition-colors">
          <Icon name="heroicons:arrow-path" :class="['w-5 h-5', isLoading ? 'animate-spin' : '']" />
        </button>
      </div>
    </div>

    <div class="glass-card flex-1 overflow-hidden flex flex-col border border-white/5">
      <div class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/10 text-[11px] font-bold text-syn-muted tracking-wider uppercase bg-white/5">
        <div class="col-span-3">Date & Time</div>
        <div class="col-span-3">Transaction ID</div>
        <div class="col-span-2">Method</div>
        <div class="col-span-2 text-right">Amount</div>
        <div class="col-span-2 text-right">Status</div>
      </div>

      <div v-if="isLoading" class="flex-1 flex items-center justify-center">
        <div class="w-8 h-8 border-2 border-syn-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div v-else-if="filteredTransactions.length === 0" class="flex-1 flex flex-col items-center justify-center text-syn-muted space-y-2">
        <Icon name="heroicons:document-text" class="w-12 h-12 opacity-20" />
        <p>No transactions found.</p>
      </div>
      <div v-else class="flex-1 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
        <div 
          v-for="tx in filteredTransactions" 
          :key="tx.id"
          @click="showDetail(tx)"
          class="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/5 transition-colors cursor-pointer group"
        >
          <div class="col-span-3">
            <p class="text-sm font-medium text-white">{{ formatDate(tx.transaction_date || tx.created_at || '') }}</p>
            <p class="text-[10px] text-syn-muted">{{ formatTime(tx.transaction_date || tx.created_at || '') }}</p>
          </div>
          <div class="col-span-3">
            <span class="text-xs font-mono text-syn-muted group-hover:text-syn-accent transition-colors">
              #TX-{{ String(tx.id).padStart(6, '0') }}
            </span>
          </div>
          <div class="col-span-2">
            <span class="text-xs text-syn-muted">{{ tx.payment_method || 'N/A' }}</span>
          </div>
          <div class="col-span-2 text-right">
            <span class="text-sm font-bold text-white">{{ formatPrice(tx.total_amount) }}</span>
          </div>
          <div class="col-span-2 text-right">
             <span :class="['text-[10px] px-2 py-1 rounded-full font-bold uppercase', getStatusClass(tx.status)]">
               {{ tx.status || 'completed' }}
             </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <ReceiptModal 
      v-if="selectedTx" 
      :transaction="selectedTx" 
      :receipt-number="`#TX-${String(selectedTx.id).padStart(6, '0')}`"
      @close="selectedTx = null" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useTransaction } from '~/composables/useTransaction';
import { transactionService } from '~/services/transaction.service';
import ReceiptModal from '../supply/ReceiptModal.vue';

const props = defineProps<{
  businessId: number;
}>();

const { isLoading, fetchTransactions, transactions } = useTransaction();
const filterStatus = ref('all');
const selectedTx = ref<any>(null);

const filteredTransactions = computed(() => {
  let list = [...transactions.value].sort((a, b) => {
    const dateA = new Date(a.transaction_date || a.created_at || 0).getTime();
    const dateB = new Date(b.transaction_date || b.created_at || 0).getTime();
    return dateB - dateA;
  });
  
  if (filterStatus.value !== 'all') {
    list = list.filter(tx => tx.status === filterStatus.value);
  }
  return list;
});

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(date));
};

const formatTime = (date: string) => {
  if (!date) return 'N/A';
  return new Intl.DateTimeFormat('id-ID', { timeStyle: 'short' }).format(new Date(date));
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed': return 'bg-emerald-500/20 text-emerald-400';
    case 'pending': return 'bg-yellow-500/20 text-yellow-400';
    case 'cancelled': return 'bg-red-500/20 text-red-400';
    default: return 'bg-emerald-500/20 text-emerald-400';
  }
};

const showDetail = async (tx: any) => {
  try {
    const response = await transactionService.getTransactionItems(tx.id);
    selectedTx.value = {
      ...tx,
      items: response.data.map(item => ({
        product: item.product || { name: `Product #${item.product_id}`, price: item.price },
        quantity: item.quantity
      }))
    };
  } catch (err) {
    console.error('Failed to fetch transaction items:', err);
  }
};

watch(() => props.businessId, (newId) => {
  if (newId) {
    fetchTransactions(newId);
  }
}, { immediate: true });
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
</style>
