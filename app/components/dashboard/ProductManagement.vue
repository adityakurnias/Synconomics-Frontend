<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-syn-cream">Product Management</h2>
      <button @click="navigateTo('/dashboard/inventory')" class="text-sm text-syn-accent font-medium hover:text-syn-gold transition-colors">View All Inventory</button>
    </div>

    <div class="bg-syn-dark border border-syn-border rounded-2xl overflow-hidden flex-1 flex flex-col glow-border">
      <!-- Header -->
      <div class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-syn-border text-[11px] font-bold text-syn-muted tracking-wider uppercase">
        <div class="col-span-5">Item Details</div>
        <div class="col-span-3">Stock Level</div>
        <div class="col-span-3">Market Demand</div>
        <div class="col-span-1 text-right">Status</div>
      </div>

      <!-- Rows -->
      <div v-if="isLoading" class="flex-1 flex items-center justify-center text-syn-muted">
        Loading products...
      </div>
      <div v-else-if="products.length === 0" class="flex-1 flex items-center justify-center text-syn-muted">
        No products found for this business.
      </div>
      <div v-else class="flex-1 divide-y divide-syn-border overflow-y-auto max-h-100">
        <div v-for="product in products" :key="product.id" class="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-syn-surface transition-colors group">
          <div class="col-span-5 flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-syn-surface flex items-center justify-center border border-syn-border">
              <img v-if="product.image_url" :src="getProductImageUrl(product.image_url)" class="w-full h-full object-cover" />
              <Icon v-else name="heroicons:cube"
                class="w-5 h-5 text-syn-muted group-hover:text-syn-accent transition-colors" />
            </div>
            <div>
              <h4 class="text-sm font-semibold text-syn-cream group-hover:text-syn-accent transition-colors">{{ product.name }}</h4>
              <p class="text-xs text-syn-muted mt-0.5">SKU: {{ generateSku(product.id) }}</p>
            </div>
          </div>
          <div class="col-span-3 flex flex-col justify-center">
            <span class="text-sm font-semibold text-syn-cream mb-1.5">{{ product.stock }} Units</span>
            <div class="h-1.5 w-24 bg-syn-border rounded-full overflow-hidden">
              <div class="h-full rounded-full" :class="getStockLevelColor(product.stock, product.min_stock)" :style="{ width: getStockLevelWidth(product.stock, product.min_stock) }"></div>
            </div>
          </div>
          <div class="col-span-3">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 h-7 rounded-lg bg-syn-accent/10 text-syn-accent border border-syn-accent/20">
              <Icon name="heroicons:map-pin" class="w-3.5 h-3.5" />
              <span class="text-[11px] font-medium leading-tight">Steady Demand<br/>within 10km</span>
            </div>
          </div>
          <div class="col-span-1 text-right">
            <span class="text-xs font-semibold" :class="getProductStatusColor(product.stock, product.min_stock)">{{ getProductStatus(product.stock, product.min_stock) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProduct } from '~/composables/useProduct';

const props = defineProps<{
  businessId: number | null;
}>();

const { products, isLoading, fetchProducts } = useProduct();
const config = useRuntimeConfig();


const navigateTo = (path: string) => {
  useRouter().push(path);
};

onMounted(() => {
  if (props.businessId) {
    fetchProducts(props.businessId);
  }
});

watch(() => props.businessId, (newId) => {
  if (newId) {
    fetchProducts(newId);
  }
});

const getProductIcon = (productName: string) => {
  if (productName.toLowerCase().includes('book')) return 'heroicons:book-open';
  if (productName.toLowerCase().includes('phone')) return 'heroicons:device-phone-mobile';
  if (productName.toLowerCase().includes('watch')) return 'heroicons:clock';
  if (productName.toLowerCase().includes('speaker')) return 'heroicons:speaker-wave';
  return 'heroicons:cube';
};

const generateSku = (productId: number) => {
  return `SKU-${String(productId).padStart(4, '0')}`;
};

const getStockLevelColor = (stock: number, minStock: number | undefined) => {
  if (minStock === undefined) minStock = 10;
  if (stock <= minStock) return 'bg-syn-danger';
  if (stock <= minStock * 2) return 'bg-syn-gold';
  return 'bg-syn-accent';
};

const getStockLevelWidth = (stock: number, minStock: number | undefined) => {
  if (minStock === undefined) minStock = 10; // Default min stock if not provided
  const maxStockDisplay = minStock * 5 > stock ? minStock * 5 : stock * 1.2; // Max for display purposes
  const percentage = (stock / maxStockDisplay) * 100;
  return `${Math.min(percentage, 100)}%`;
};

const getProductStatus = (stock: number, minStock: number | undefined) => {
  if (minStock === undefined) minStock = 10; // Default min stock if not provided
  if (stock === 0) return 'Out of Stock';
  if (stock <= minStock) return 'Low Stock';
  return 'In Stock';
};

const getProductStatusColor = (stock: number, minStock: number | undefined) => {
  if (minStock === undefined) minStock = 10; // Default min stock if not provided
  if (stock === 0) return 'text-syn-danger';
  if (stock <= minStock) return 'text-syn-warning';
  return 'text-syn-success';
};

const getProductImageUrl = (imageUrl: string) => {
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${config.public.apiBase}${path}`;
};
</script>
