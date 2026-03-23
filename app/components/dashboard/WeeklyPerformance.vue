<template>
  <div class="bg-syn-dark border border-syn-border rounded-2xl p-5 hover:border-syn-accent/20 transition-colors glow-border">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-sm font-semibold text-syn-cream">Weekly Performance</h3>
      <button class="text-syn-muted hover:text-syn-accent transition-colors">
        <Icon name="heroicons:ellipsis-horizontal" class="w-5 h-5" />
      </button>
    </div>

    <div class="h-32 flex items-end justify-between gap-2 mt-auto">
      <div class="w-full bg-syn-surface rounded-t-sm hover:bg-syn-accent/50 transition-colors cursor-pointer" style="height: 30%;"></div>
      <div class="w-full bg-syn-surface rounded-t-sm hover:bg-syn-accent/50 transition-colors cursor-pointer" style="height: 45%;"></div>
      <div class="w-full bg-syn-surface rounded-t-sm hover:bg-syn-accent/50 transition-colors cursor-pointer" style="height: 35%;"></div>
      <div class="w-full bg-syn-surface rounded-t-sm hover:bg-syn-accent/50 transition-colors cursor-pointer" style="height: 60%;"></div>
      <div class="w-full bg-syn-accent rounded-t-sm hover:bg-syn-gold transition-colors cursor-pointer relative group" style="height: 100%;">
        <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-syn-darker text-syn-cream border border-syn-accent/20 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">Peak</div>
      </div>
      <div class="w-full bg-syn-surface rounded-t-sm hover:bg-syn-accent/50 transition-colors cursor-pointer" style="height: 50%;"></div>
      <div class="w-full bg-syn-surface rounded-t-sm hover:bg-syn-accent/50 transition-colors cursor-pointer" style="height: 40%;"></div>
    </div>
  </div>
</template>
