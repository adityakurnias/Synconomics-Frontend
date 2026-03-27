import type { Product } from './product.types';

export interface Transaction {
  id: number;
  business_id: number;
  total_amount: number;
  payment_method: string;
  status: 'pending' | 'completed' | 'cancelled';
  transaction_date: string;
  created_at?: string;
  transactionItems?: TransactionItem[];
}

export interface TransactionItem {
  id: number;
  transaction_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at?: string;
  product?: Product;
}

export interface CreateTransactionRequest {
  business_id: number;
  total_amount: number;
  payment_method: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface CreateTransactionItemRequest {
  transaction_id: number;
  product_id: number;
  quantity: number;
  price: number;
}
