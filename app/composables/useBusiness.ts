import { ref } from 'vue';
import { businessService } from '../services/business.service';
import type { Business, BusinessMetric } from '../types/business.types';

export const useBusiness = () => {
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref<string | null>(null);
  
  const businesses = ref<Business[]>([]);
  const currentBusiness = ref<Business | null>(null);
  const metrics = ref<BusinessMetric[]>([]);

  const fetchBusinesses = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await businessService.getAll();
      businesses.value = response.data || [];
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal memuat data bisnis';
    } finally {
      isLoading.value = false;
    }
  };

  const getBusinessById = async (id: number) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await businessService.getById(id);
      currentBusiness.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal memuat detail bisnis';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const createBusiness = async (formData: FormData) => {
    isSaving.value = true;
    error.value = null;
    try {
      const response = await businessService.create(formData);
      businesses.value.push(response.data);
      return response.data;
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal membuat profil bisnis';
      throw err;
    } finally {
      isSaving.value = false;
    }
  };

  const updateBusiness = async (id: number, formData: FormData) => {
    isSaving.value = true;
    error.value = null;
    try {
      const response = await businessService.update(id, formData);
      const index = businesses.value.findIndex(b => b.id === id);
      if (index !== -1) {
        businesses.value[index] = response.data;
      }
      return response.data;
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal mengubah profil bisnis';
      throw err;
    } finally {
      isSaving.value = false;
    }
  };

  const fetchMetrics = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await businessService.getMetrics();
      metrics.value = response.data || [];
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal memuat data metric';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    isSaving,
    error,
    businesses,
    currentBusiness,
    metrics,
    fetchBusinesses,
    getBusinessById,
    createBusiness,
    updateBusiness,
    fetchMetrics
  };
};
