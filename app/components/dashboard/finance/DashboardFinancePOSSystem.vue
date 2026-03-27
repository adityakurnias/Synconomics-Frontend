<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
    <!-- Product Selection (Left) -->
    <div class="lg:col-span-2 flex flex-col space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-display text-white">Produk</h3>
        <div class="relative w-64">
           <span class="absolute left-3 top-1/2 -translate-y-1/2 text-syn-muted">
             <Icon name="heroicons:magnifying-glass" class="w-4 h-4" />
           </span>
           <input 
             v-model="searchQuery"
             type="text" 
             placeholder="Search products..." 
             class="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-syn-accent outline-none text-white transition-colors"
           />
        </div>
      </div>

      <div class="glass-card flex-1 overflow-hidden flex flex-col p-4 border border-white/5">
        <div v-if="isLoadingProducts" class="flex-1 flex items-center justify-center">
          <div class="w-8 h-8 border-2 border-syn-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div v-else-if="filteredProducts.length === 0" class="flex-1 flex flex-col items-center justify-center text-syn-muted space-y-2">
          <Icon name="heroicons:cube-transparent" class="w-12 h-12 opacity-20" />
          <p>No products found.</p>
        </div>
        <div v-else class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <div 
            v-for="product in filteredProducts" 
            :key="product.id"
            @click="addToCart(product)"
            class="group bg-white/5 border border-white/5 hover:border-syn-accent/30 rounded-2xl p-3 cursor-pointer transition-all hover:bg-white/10"
          >
            <div class="aspect-square rounded-xl bg-syn-darker mb-3 overflow-hidden border border-white/5 flex items-center justify-center">
               <img v-if="product.image_url" :src="getImageUrl(product.image_url)" class="w-full h-full object-cover" />
               <Icon v-else name="heroicons:cube" class="w-8 h-8 text-syn-muted group-hover:text-syn-accent transition-colors" />
            </div>
            <div class="space-y-1">
              <h4 class="text-sm font-medium text-white truncate">{{ product.name }}</h4>
              <p class="text-xs text-syn-muted">{{ formatPrice(product.price) }}</p>
              <div class="flex items-center justify-between pt-1">
                <span :class="['text-[10px] px-1.5 py-0.5 rounded-md font-medium capitalize', stockStatus(product).class]">
                  {{ stockStatus(product).text }}
                </span>
                <span class="text-[10px] text-syn-muted">{{ product.stock }} tersisa</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cart / Order Summary (Right) -->
    <div class="flex flex-col space-y-4">
      <h3 class="text-xl font-display text-white">Ringkasan Pesanan</h3>
      
      <div class="glass-card flex-1 flex flex-col p-6 border border-white/5">
        <div v-if="cart.length === 0" class="flex-1 flex flex-col items-center justify-center text-syn-muted space-y-4 p-8 text-center">
          <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
            <Icon name="heroicons:shopping-bag" class="w-8 h-8 opacity-20" />
          </div>
          <div>
            <p class="font-medium text-white/60">Keranjang kosong</p>
            <p class="text-xs">Tambahkan produk untuk memulai transaksi</p>
          </div>
        </div>
        
        <div v-else class="flex-1 flex flex-col overflow-hidden">
          <div class="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar mb-6">
            <div v-for="item in cart" :key="item.product.id" class="flex items-center gap-3 group">
              <div class="w-12 h-12 rounded-lg bg-white/5 border border-white/5 overflow-hidden shrink-0 flex items-center justify-center">
                <img v-if="item.product.image_url" :src="getImageUrl(item.product.image_url)" class="w-full h-full object-cover" />
                <Icon v-else name="heroicons:cube" class="w-5 h-5 text-syn-muted" />
              </div>
              <div class="flex-1 min-w-0">
                <h5 class="text-sm font-medium text-white truncate">{{ item.product.name }}</h5>
                <p class="text-xs text-syn-muted">{{ formatPrice(item.product.price) }}</p>
              </div>
              <div class="flex items-center gap-2 bg-white/5 rounded-lg border border-white/10 p-1">
                <button @click="updateQuantity(item.product.id, item.quantity - 1)" class="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded transition-colors">
                  <Icon name="heroicons:minus" class="w-3 h-3 text-white" />
                </button>
                <input type="text" inputmode="numeric" pattern="[0-9]*" v-model="item.quantity" class="text-xs font-medium w-5 text-center text-white bg-transparent border-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <button @click="addToCart(item.product)" class="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded transition-colors">
                  <Icon name="heroicons:plus" class="w-3 h-3 text-white" />
                </button>
              </div>
              <button @click="removeFromCart(item.product.id)" class="text-syn-muted hover:text-red-400 p-1">
                <Icon name="heroicons:trash" class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Totals -->
          <div class="space-y-3 pt-6 border-t border-white/10">
            <div class="flex justify-between items-center text-sm">
              <span class="text-syn-muted">Subtotal</span>
              <span class="text-white">{{ formatPrice(cartTotal) }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-syn-muted">Pajak (0%)</span>
              <span class="text-white">Rp 0</span>
            </div>
            <div class="flex justify-between items-center pt-3 border-t border-white/10">
              <span class="text-lg font-display text-white">Total</span>
              <span class="text-2xl font-display text-syn-accent">{{ formatPrice(cartTotal) }}</span>
            </div>
          </div>

          <!-- Action -->
          <div class="mt-6 space-y-3">
             <div class="flex flex-col gap-2">
               <label class="text-xs text-syn-muted uppercase font-bold tracking-wider">Metode Pembayaran</label>
               <div class="grid grid-cols-2 gap-2">
                 <button 
                   v-for="method in ['Tunai', 'Transfer']"
                   :key="method"
                   @click="paymentMethod = method"
                   :class="['py-2 px-3 rounded-xl border text-xs font-medium transition-all text-center', paymentMethod === method ? 'bg-syn-accent/20 border-syn-accent text-syn-accent' : 'bg-white/5 border-white/10 text-syn-muted hover:bg-white/10']"
                 >
                   {{ method }}
                 </button>
               </div>
             </div>
             <button 
               @click="handleCheckout"
               :disabled="isLoading || cart.length === 0"
               class="w-full py-4 bg-syn-accent text-syn-dark rounded-2xl font-display font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
             >
               <Icon v-if="isLoading" name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
               <span v-else>Selesaikan Transaksi</span>
             </button>
             <button 
               @click="clearCart"
               :disabled="isLoading || cart.length === 0"
               class="w-full py-2 text-syn-muted hover:text-red-400 text-xs transition-colors"
             >
               Kosongkan Keranjang
             </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Receipt Modal -->
    <ReceiptModal 
      v-if="showReceipt" 
      :transaction="completedTransaction" 
      :receipt-number="currentReceiptNumber"
      @close="showReceipt = false" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useProduct } from '~/composables/useProduct';
import { useTransaction } from '~/composables/useTransaction';
import ReceiptModal from '../supply/ReceiptModal.vue';

const props = defineProps<{
  businessId: number;
}>();

const { products, isLoading: isLoadingProducts, fetchProducts } = useProduct();
const { 
  isLoading, 
  error, 
  cart, 
  cartTotal, 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  processTransaction,
  generateReceiptNumber
} = useTransaction();

const searchQuery = ref('');
const paymentMethod = ref('Cash');
const showReceipt = ref(false);
const completedTransaction = ref<any>(null);
const currentReceiptNumber = ref('');

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  const query = searchQuery.value.toLowerCase();
  return products.value.filter(p => p.name.toLowerCase().includes(query));
});

const getImageUrl = (path: string) => {
  if (!path) return '';
  const baseUrl = 'https://api-synconomics.synchronizeteams.com';
  return `${baseUrl}/${path.replace(/^\//, '')}`;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

const stockStatus = (product: any) => {
  const min = product.min_stock || 10;
  if (product.stock === 0) return { text: 'Habis', class: 'bg-red-500/20 text-red-400' };
  if (product.stock <= min) return { text: 'Stok Rendah', class: 'bg-yellow-500/20 text-yellow-400' };
  return { text: 'Tersedia', class: 'bg-emerald-500/20 text-emerald-400' };
};

const handleCheckout = async () => {
  try {
    const transaction = await processTransaction(props.businessId, paymentMethod.value);
    if (transaction) {
      // Attach cart items for receipt display
      completedTransaction.value = {
        ...transaction,
        items: [...cart.value]
      };
      currentReceiptNumber.value = generateReceiptNumber();
      showReceipt.value = true;
      // Refresh products (for stock update if backend handles it)
      fetchProducts(props.businessId);
    }
  } catch (err) {
    console.error('Checkout failed:', err);
  }
};

onMounted(() => {
  fetchProducts(props.businessId);
});
</script>
