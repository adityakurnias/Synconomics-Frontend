<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-end justify-between">
      <div>
        <h1 class="text-3xl font-serif text-syn-cream mb-2 tracking-tight">Inventory Details</h1>
        <p class="text-syn-muted text-[15px]">Comprehensive view of all products, stock levels, and metrics.</p>
      </div>

      <div class="flex gap-3">
        <button
          @click="openCreateModal"
          v-if="activeBusinessId"
          class="flex items-center gap-2 bg-syn-accent text-syn-dark px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-white"
        >
          <Icon name="heroicons:plus" class="w-4 h-4" />
          Add Product
        </button>
      </div>
    </div>

    <!-- Inventory Table Wrapper -->
    <div class="bg-syn-dark border border-syn-border rounded-2xl overflow-hidden flex flex-col glow-border relative min-h-[400px]">

      <div v-if="isLoading" class="absolute inset-0 bg-syn-darker/50 backdrop-blur-sm z-10 flex items-center justify-center">
        <div class="w-10 h-10 border-4 border-syn-accent border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Search/Filters Bar -->
      <div class="p-4 border-b border-syn-border flex items-center justify-between bg-syn-darker/50">
        <div class="relative w-80">
          <Icon name="heroicons:magnifying-glass" class="w-4 h-4 text-syn-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search SKUs or product names..."
            class="w-full bg-syn-surface border border-syn-border rounded-lg py-1.5 pl-10 pr-4 text-sm text-syn-cream placeholder-syn-muted focus:outline-none focus:border-syn-accent/30 transition-all"
          />
        </div>
        <div class="flex items-center gap-3 text-sm text-syn-muted">
          Showing {{ filteredProducts.length }} items
        </div>
      </div>

      <!-- Header row -->
      <div class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-syn-border text-[11px] font-bold text-syn-muted tracking-wider uppercase bg-syn-surface/30">
        <div class="col-span-1"></div>
        <div class="col-span-4">Product Details</div>
        <div class="col-span-2">Category</div>
        <div class="col-span-2 text-right">Unit Price</div>
        <div class="col-span-2 text-right">Available Stock</div>
        <div class="col-span-1 text-center">Actions</div>
      </div>

      <!-- List -->
      <div v-if="filteredProducts.length === 0" class="py-20 text-center text-syn-muted">
        Tidak ada produk dalam inventaris. Tambahkan produk pertama Anda.
      </div>
      <div v-else class="divide-y divide-syn-border bg-syn-dark">
        <div v-for="item in filteredProducts" :key="item.id" class="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-syn-surface transition-colors group">

          <div class="col-span-1">
             <div class="w-10 h-10 rounded-xl bg-syn-surface flex items-center justify-center border border-syn-border group-hover:border-syn-accent/30 transition-colors overflow-hidden">
               <img v-if="item.image_url" :src="getProductImageUrl(item.image_url)" class="w-full h-full object-cover"/>
               <Icon v-else name="heroicons:cube" class="w-5 h-5 text-syn-muted group-hover:text-syn-accent transition-colors" />
            </div>
          </div>

          <div class="col-span-4">
            <h4 class="text-sm font-semibold text-syn-cream group-hover:text-syn-accent transition-colors">{{ item.name }}</h4>
            <p class="text-xs text-syn-muted mt-0.5 font-mono">ID: PROD-{{ item.id }}</p>
          </div>

          <div class="col-span-2">
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-syn-surface text-syn-muted border border-syn-border">
              {{ item.description ? 'Aktif' : 'N/A' }}
            </span>
          </div>

          <div class="col-span-2 text-right">
            <span class="text-sm font-medium text-syn-cream">{{ formatCurrency(item.price) }}</span>
          </div>

          <div class="col-span-2 text-right flex flex-col items-end justify-center">
            <span :class="['text-sm font-bold mb-1.5', item.stock > 10 ? 'text-syn-cream' : 'text-syn-warning']">{{ item.stock.toLocaleString() }}</span>
            <div class="h-1.5 w-16 bg-syn-border rounded-full overflow-hidden">
              <div :class="['h-full rounded-full', item.stock > 10 ? 'bg-syn-success' : 'bg-syn-warning']" :style="{ width: Math.min(100, (item.stock / 100) * 100) + '%' }"></div>
            </div>
          </div>

          <div class="col-span-1 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="handleEdit(item)" class="p-1.5 flex text-syn-muted hover:text-syn-cream bg-syn-surface rounded-md border border-syn-border hover:border-syn-accent/30 transition-colors">
              <Icon name="heroicons:pencil-square" class="w-4 h-4" />
            </button>
            <button @click="handleDelete(item.id)" class="p-1.5 flex text-syn-muted hover:text-red-400 bg-syn-surface rounded-md border border-syn-border hover:border-red-500/30 transition-colors">
              <Icon name="heroicons:trash" class="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- Modal -->
    <DashboardProductFormModal
      v-if="showModal"
      :businessId="activeBusinessId"
      :initialData="selectedProduct"
      @close="closeModal"
      @saved="onProductSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRuntimeConfig } from '#app';

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
});

const showModal = ref(false);
const selectedProduct = ref(null);
const searchQuery = ref(''); // Added for search functionality

const { businesses, fetchBusinesses } = useBusiness();
const { products, isLoading, fetchProducts, deleteProduct } = useProduct();
const config = useRuntimeConfig();

const activeBusinessId = ref<number>(0);

const filteredProducts = computed(() => {
  if (!searchQuery.value) {
    return products.value;
  }
  const query = searchQuery.value.toLowerCase();
  return products.value.filter(product =>
    product.name.toLowerCase().includes(query) ||
    `PROD-${product.id}`.toLowerCase().includes(query) // Assuming product.id is a number
  );
});

onMounted(async () => {
  await fetchBusinesses();
  const firstBusiness = businesses.value?.[0];
  if (firstBusiness) {
    activeBusinessId.value = firstBusiness.id;
    await fetchProducts(activeBusinessId.value);
  }
});

const handleBusinessChange = async () => {
  if (activeBusinessId.value) {
    await fetchProducts(activeBusinessId.value);
  }
};

const openCreateModal = () => {
  selectedProduct.value = null;
  showModal.value = true;
};

const handleEdit = (product: any) => {
  selectedProduct.value = product;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedProduct.value = null;
};

const onProductSaved = async () => {
  closeModal();
  if (activeBusinessId.value) {
    await fetchProducts(activeBusinessId.value);
  }
};

const handleDelete = async (id: number) => {
  if (confirm('Anda yakin ingin menghapus produk ini?')) {
    await deleteProduct(id);
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const getProductImageUrl = (imageUrl: string) => {
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${config.public.apiBase}${path}`;
};
</script>
