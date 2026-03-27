<template>
  <div class="flex flex-col space-y-6 h-full">
    <div class="flex items-center justify-between">
      <h3 class="text-xl font-display text-white">Expense Management</h3>
      <button 
        @click="showModal = true"
        class="px-4 py-2 bg-syn-accent text-syn-dark rounded-xl font-bold text-sm hover:bg-white transition-all flex items-center gap-2"
      >
        <Icon name="heroicons:plus-circle" class="w-5 h-5" />
        Record Expense
      </button>
    </div>

    <div class="glass-card flex-1 overflow-hidden flex flex-col border border-white/5">
      <div class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/10 text-[11px] font-bold text-syn-muted tracking-wider uppercase bg-white/5">
        <div class="col-span-3">Date</div>
        <div class="col-span-4">Category & Title</div>
        <div class="col-span-3 text-right">Amount</div>
        <div class="col-span-2 text-right">Actions</div>
      </div>

      <div v-if="isLoading" class="flex-1 flex items-center justify-center">
        <div class="w-8 h-8 border-2 border-syn-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div v-else-if="expenses.length === 0" class="flex-1 flex flex-col items-center justify-center text-syn-muted space-y-2">
        <Icon name="heroicons:banknotes" class="w-12 h-12 opacity-20" />
        <p>No expenses recorded yet.</p>
      </div>
      <div v-else class="flex-1 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
        <div 
          v-for="expense in sortedExpenses" 
          :key="expense.id"
          class="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/5 transition-colors group"
        >
          <div class="col-span-3">
            <span class="text-xs text-syn-muted">{{ formatDate(expense.expense_date || expense.created_at || '') }}</span>
          </div>
          <div class="col-span-4">
            <p class="text-[10px] text-syn-accent uppercase font-black tracking-widest mb-0.5">{{ expense.category }}</p>
            <p class="text-sm font-medium text-white truncate">{{ expense.title }}</p>
          </div>
          <div class="col-span-3 text-right">
            <span class="text-sm font-bold text-red-400">- {{ formatPrice(expense.amount) }}</span>
          </div>
          <div class="col-span-2 text-right">
            <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click="editExpense(expense)" class="p-1.5 text-syn-muted hover:text-syn-accent transition-colors">
                <Icon name="heroicons:pencil-square" class="w-4 h-4" />
              </button>
              <button @click="confirmDelete(expense.id)" class="p-1.5 text-syn-muted hover:text-red-400 transition-colors">
                <Icon name="heroicons:trash" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Expense Modal -->
    <ExpenseFormModal 
      v-if="showModal"
      :business-id="businessId"
      :initial-data="editingExpense"
      @close="closeModal"
      @saved="onSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useExpense } from '~/composables/useExpense';
import ExpenseFormModal from '../ExpenseFormModal.vue';

const props = defineProps<{
  businessId: number;
}>();

const { expenses, isLoading, fetchExpenses, deleteExpense } = useExpense();
const showModal = ref(false);
const editingExpense = ref<any>(null);

const sortedExpenses = computed(() => {
  return [...expenses.value].sort((a, b) => {
    const dateA = new Date(a.expense_date || a.created_at || 0).getTime();
    const dateB = new Date(b.expense_date || b.created_at || 0).getTime();
    return dateB - dateA;
  });
});

const formatDate = (date: string) => {
  if (!date) return 'N/A';
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(date));
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

const editExpense = (expense: any) => {
  editingExpense.value = expense;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingExpense.value = null;
};

const emit = defineEmits<{
  (e: 'expenseSaved'): void;
}>();

// ... existing code ...

const onSaved = () => {
  closeModal();
  emit('expenseSaved'); // Emit event instead of direct fetch
};

const confirmDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this expense record?')) {
    try {
      await deleteExpense(id);
    } catch (err) {
      console.error('Failed to delete expense:', err);
    }
  }
};

watch(() => props.businessId, (newId) => {
  if (newId) {
    fetchExpenses(newId);
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
