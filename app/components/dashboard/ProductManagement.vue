<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-syn-cream">Product Management</h2>
      <button class="text-sm text-syn-accent font-medium hover:text-syn-gold transition-colors">View All Inventory</button>
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
      <div class="flex-1 divide-y divide-syn-border overflow-y-auto max-h-[400px]">
        <!-- Item 1 -->
        <div class="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-syn-surface transition-colors group">
          <div class="col-span-5 flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-syn-surface flex items-center justify-center border border-syn-border">
               <Icon name="heroicons:computer-desktop" class="w-5 h-5 text-syn-muted group-hover:text-syn-accent transition-colors" />
            </div>
            <div>
              <h4 class="text-sm font-semibold text-syn-cream group-hover:text-syn-accent transition-colors">UltraBook Pro 16"</h4>
              <p class="text-xs text-syn-muted mt-0.5">SKU: UB-16-004</p>
            </div>
          </div>
          <div class="col-span-3 flex flex-col justify-center">
            <span class="text-sm font-semibold text-syn-cream mb-1.5">1,240 Units</span>
            <div class="h-1.5 w-24 bg-syn-border rounded-full overflow-hidden">
              <div class="h-full bg-syn-accent rounded-full" style="width: 75%"></div>
            </div>
          </div>
          <div class="col-span-3">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 h-7 rounded-lg bg-syn-success/10 text-syn-success border border-syn-success/20">
              <Icon name="heroicons:arrows-pointing-in" class="w-3.5 h-3.5" />
              <span class="text-[11px] font-medium leading-tight">High Demand<br/>within 5km</span>
            </div>
          </div>
          <div class="col-span-1 text-right">
            <span class="text-xs font-semibold text-syn-success">In Stock</span>
          </div>
        </div>

        <!-- Item 2 -->
        <div class="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-syn-surface transition-colors group">
          <div class="col-span-5 flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-syn-surface flex items-center justify-center border border-syn-border">
               <Icon name="heroicons:speaker-wave" class="w-5 h-5 text-syn-muted group-hover:text-syn-accent transition-colors" />
            </div>
            <div>
              <h4 class="text-sm font-semibold text-syn-cream group-hover:text-syn-accent transition-colors">SonicBuds Gen 2</h4>
              <p class="text-xs text-syn-muted mt-0.5">SKU: SB-G2-882</p>
            </div>
          </div>
          <div class="col-span-3 flex flex-col justify-center">
            <span class="text-sm font-semibold text-syn-cream mb-1.5">42 Units</span>
            <div class="h-1.5 w-24 bg-syn-border rounded-full overflow-hidden">
              <div class="h-full bg-syn-gold rounded-full" style="width: 15%"></div>
            </div>
          </div>
          <div class="col-span-3">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 h-7 rounded-lg bg-syn-accent/10 text-syn-accent border border-syn-accent/20">
              <Icon name="heroicons:map-pin" class="w-3.5 h-3.5" />
              <span class="text-[11px] font-medium leading-tight">Steady Demand<br/>within 10km</span>
            </div>
          </div>
          <div class="col-span-1 text-right">
            <span class="text-xs font-semibold text-syn-warning">Low Stock</span>
          </div>
        </div>

        <!-- Item 3 -->
        <div class="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-syn-surface transition-colors group">
          <div class="col-span-5 flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-syn-surface flex items-center justify-center border border-syn-border">
               <Icon name="heroicons:clock" class="w-5 h-5 text-syn-muted group-hover:text-syn-accent transition-colors" />
            </div>
            <div>
              <h4 class="text-sm font-semibold text-syn-cream group-hover:text-syn-accent transition-colors">Nexus Watch S3</h4>
              <p class="text-xs text-syn-muted mt-0.5">SKU: NW-S3-112</p>
            </div>
          </div>
          <div class="col-span-3 flex flex-col justify-center">
            <span class="text-sm font-semibold text-syn-cream mb-1.5">890 Units</span>
            <div class="h-1.5 w-24 bg-syn-border rounded-full overflow-hidden">
              <div class="h-full bg-syn-accent rounded-full" style="width: 55%"></div>
            </div>
          </div>
          <div class="col-span-3">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 h-7 rounded-lg bg-syn-danger/10 text-syn-danger border border-syn-danger/20">
              <Icon name="heroicons:arrow-trending-down" class="w-3.5 h-3.5" />
              <span class="text-[11px] font-medium leading-tight">Low Demand<br/>City-wide</span>
            </div>
          </div>
          <div class="col-span-1 text-right">
            <span class="text-xs font-semibold text-syn-success">In Stock</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
