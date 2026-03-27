import { ref, computed } from 'vue';
import { transactionService } from '../services/transaction.service';
import type { Transaction, TransactionItem, CreateTransactionRequest, CreateTransactionItemRequest } from '../types/transaction.types';
import type { Product } from '../types/product.types';

export const useTransaction = () => {
  const isLoading = useState('transaction-is-loading', () => false);
  const error = useState<string | null>('transaction-error', () => null);
  const transactions = useState<Transaction[]>('transaction-list', () => []);
  
  // POS Cart State
  const cart = useState<Array<{ product: Product; quantity: number }>>('pos-cart', () => []);
  
  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.value.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity = Number(existingItem.quantity) + 1;
    } else {
      cart.value.push({ product, quantity: 1 });
    }
  };

  const removeFromCart = (productId: number) => {
    cart.value = cart.value.filter(item => item.product.id !== productId);
  };

  const updateQuantity = (productId: number, quantity: any) => {
    const item = cart.value.find(item => item.product.id === productId);
    if (item) {
      item.quantity = Math.max(1, Number(quantity));
    }
  };

  const clearCart = () => {
    cart.value = [];
  };

  const fetchTransactions = async (businessId: number) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await transactionService.getTransactionsByBusinessId(businessId);
      transactions.value = response.data || [];
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal memuat daftar transaksi';
    } finally {
      isLoading.value = false;
    }
  };

  const processTransaction = async (businessId: number, paymentMethod: string) => {
    if (cart.value.length === 0) return null;

    isLoading.value = true;
    error.value = null;
    try {
      // 1. Create Transaction
      const transactionPayload: CreateTransactionRequest = {
        business_id: businessId,
        total_amount: cartTotal.value,
        payment_method: paymentMethod,
        status: 'completed'
      };

      const transResponse = await transactionService.createTransaction(transactionPayload);
      const newTransaction = transResponse.data;

      // 2. Create Transaction Items
      const itemPromises = cart.value.map(item => {
        const itemPayload: CreateTransactionItemRequest = {
          transaction_id: newTransaction.id,
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        };
        return transactionService.createTransactionItem(itemPayload);
      });

      await Promise.all(itemPromises);

      // 3. Clear cart and return transaction
      clearCart();
      return newTransaction;
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal memproses transaksi';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Helper to generate a unique receipt number
  const generateReceiptNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `TRX-${timestamp}-${randomStr}`;
  };

  return {
    isLoading,
    error,
    transactions,
    cart,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchTransactions,
    processTransaction,
    generateReceiptNumber
  };
};
