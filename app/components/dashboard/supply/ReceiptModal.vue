<template>
  <div class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
    <div class="glass-card max-w-sm w-full p-0 overflow-hidden rounded-3xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="px-6 py-4 flex justify-between items-center bg-white/5 border-b border-white/10">
        <h3 class="text-sm font-bold text-white uppercase tracking-widest">Struk Transaksi</h3>
        <button @click="$emit('close')" class="text-syn-muted hover:text-white transition-colors">
          <Icon name="heroicons:x-mark" class="w-5 h-5" />
        </button>
      </div>

      <!-- Receipt Body (Printable Area) -->
      <div id="receipt-content" class="p-8 bg-white text-syn-dark font-mono text-[12px] leading-relaxed">
        <div class="text-center mb-6">
          <h2 class="text-lg font-bold uppercase mb-1">Synconomics POS</h2>
          <p class="text-[10px] text-gray-500 italic">Solusi Cerdas untuk Bisnis Lokal</p>
          <div class="my-4 border-b border-dashed border-gray-300"></div>
          <div class="flex justify-between text-[10px]">
            <span>Struk: {{ receiptNumber }}</span>
            <span>{{ formatDate(new Date()) }}</span>
          </div>
        </div>

        <div class="space-y-2 mb-6">
          <div v-for="item in transaction.items" :key="item.product.id" class="flex justify-between items-start">
            <div class="flex-1 pr-4">
              <p class="font-bold">{{ item.product.name }}</p>
              <p class="text-[10px] text-gray-500">{{ item.quantity }} x {{ formatPrice(item.product.price) }}</p>
            </div>
            <span class="font-bold">{{ formatPrice(item.product.price * item.quantity) }}</span>
          </div>
        </div>

        <div class="border-t border-dashed border-gray-300 py-4 space-y-2">
          <div class="flex justify-between font-bold">
            <span>Subtotal</span>
            <span>{{ formatPrice(transaction.total_amount) }}</span>
          </div>
          <div class="flex justify-between text-[10px]">
            <span>Pajak (0%)</span>
            <span>Rp 0</span>
          </div>
          <div class="flex justify-between text-base font-black border-t border-gray-800 pt-2 mt-2">
            <span>TOTAL</span>
            <span>{{ formatPrice(transaction.total_amount) }}</span>
          </div>
        </div>

        <div class="mt-6 flex justify-between text-[10px]">
          <span>Pembayaran: {{ transaction.payment_method }}</span>
          <span class="font-bold">STATUS: LUNAS</span>
        </div>

        <div class="mt-10 text-center text-[10px] text-gray-400">
          <p>Terima kasih atas pembelian Anda!</p>
          <p>Didukung oleh Synconomics</p>
        </div>
      </div>

      <!-- Modal Actions -->
      <div class="p-6 bg-syn-darker flex gap-3">
        <button 
          @click="printReceipt"
          class="flex-1 py-3 bg-white text-syn-dark rounded-xl font-bold text-sm hover:bg-syn-accent transition-colors flex items-center justify-center gap-2"
        >
          <Icon name="heroicons:printer" class="w-4 h-4" />
          Cetak Struk
        </button>
        <button 
          @click="$emit('close')"
          class="flex-1 py-3 bg-white/5 border border-white/10 text-syn-muted rounded-xl font-bold text-sm hover:bg-white/10 transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  transaction: any;
  receiptNumber: string;
}>();

defineEmits<{
  (e: 'close'): void;
}>();

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date);
};

const printReceipt = () => {
  const printContents = document.getElementById('receipt-content')?.innerHTML;
  if (!printContents) return;
  
  const originalContents = document.body.innerHTML;
  const printWindow = window.open('', '', 'height=600,width=400');
  
  if (printWindow) {
    printWindow.document.write('<html><head><title>Print Receipt</title>');
    printWindow.document.write('<style>body { font-family: monospace; font-size: 12px; padding: 20px; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  }
};
</script>
