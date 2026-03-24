import { ref } from 'vue';
import { expenseService } from '../services/expense.service';
import type { Expense } from '../types/expense.types';

export const useExpense = () => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const expenses = ref<Expense[]>([]);

  const fetchExpenses = async (businessId: number) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await expenseService.getByBusinessId(businessId);
      expenses.value = response.data || [];
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal memuat expenses';
    } finally {
      isLoading.value = false;
    }
  };

  const createExpense = async (businessId: number, data: any) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await expenseService.create(businessId, data);
      expenses.value.push(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal membuat expense';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteExpense = async (id: number) => {
    isLoading.value = true;
    error.value = null;
    try {
      await expenseService.delete(id);
      expenses.value = expenses.value.filter(e => e.id !== id);
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal menghapus expense';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    expenses,
    fetchExpenses,
    createExpense,
    deleteExpense
  };
};
