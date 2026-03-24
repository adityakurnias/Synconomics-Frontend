import { ref } from 'vue';
import { trendService } from '../services/trend.service';
import type { Trend } from '../types/trend.types';

export const useTrend = () => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const trends = ref<Trend[]>([]);

  const fetchTopTrends = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await trendService.getTopTrends();
      trends.value = response.data || [];
    } catch (err: any) {
      error.value = err.data?.message || 'Gagal memuat tren pasar';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    trends,
    fetchTopTrends
  };
};
