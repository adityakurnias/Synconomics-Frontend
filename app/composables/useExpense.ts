import { ref } from 'vue';
import { expenseService } from '../services/expense.service';
import type { Expense } from '../types/expense.types';

export const useExpense = () => {
  const isLoading = useState('expense-is-loading', () => false);
  const error = useState<string | null>('expense-error', () => null);
  const expenses = useState<Expense[]>('expense-list', () => []);

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

  const createExpense = async (data: any) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await expenseService.create(data);
      expenses.value.unshift(response.data);
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

  const updateExpense = async (id: number, payload: any) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await expenseService.update(id, payload);
      const index = expenses.value.findIndex(e => e.id === id);
      if (index !== -1) {
        expenses.value[index] = response.data;
      }
      return response.data;
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal mengubah transaksi';
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
    updateExpense,
    deleteExpense
  };
};
