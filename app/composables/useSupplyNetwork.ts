import { ref } from 'vue';
import { businessService } from '../services/business.service';
import type { Business } from '../types/business.types';

export const useSupplyNetwork = () => {
  const businesses = ref<Business[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchPublicBusinesses = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await businessService.getAllPublic();
      businesses.value = response.data;
    } catch (err: any) {
      error.value = err.message || err.data?.message || 'Gagal memuat data network bisnis.';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    businesses,
    isLoading,
    error,
    fetchPublicBusinesses
  };
};
