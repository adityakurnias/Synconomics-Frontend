import { ref } from 'vue';
import { productService } from '../services/product.service';
import type { Product } from '../types/product.types';

export const useProduct = () => {
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref<string | null>(null);
  const products = ref<Product[]>([]);

  const fetchProducts = async (businessId: number) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await productService.getByBusinessId(businessId);
      products.value = response.data || [];
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal memuat produk';
    } finally {
      isLoading.value = false;
    }
  };

  const createProduct = async (businessId: number, formData: FormData) => {
    isSaving.value = true;
    error.value = null;
    try {
      const response = await productService.create(businessId, formData);
      products.value.push(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal membuat produk';
      throw err;
    } finally {
      isSaving.value = false;
    }
  };

  const deleteProduct = async (id: number) => {
    isLoading.value = true;
    error.value = null;
    try {
      await productService.delete(id);
      products.value = products.value.filter(p => p.id !== id);
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal menghapus produk';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    isSaving,
    error,
    products,
    fetchProducts,
    createProduct,
    deleteProduct
  };
};
