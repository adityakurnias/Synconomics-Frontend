<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-syn-cream flex items-center gap-2">
        AI Mentor Advice
      </h2>
      <Icon name="heroicons:sparkles" class="w-5 h-5 text-syn-accent" />
    </div>

    <div class="bg-syn-dark border border-syn-border rounded-2xl flex-1 flex flex-col relative overflow-hidden group hover:border-syn-accent/20 transition-colors glow-border">
      <div class="absolute top-0 right-0 w-32 h-32 bg-syn-accent/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
      
      <div class="p-6 flex-1 overflow-y-auto space-y-6">
        
        <!-- Advice Item 1 -->
        <div>
          <p class="text-[10px] font-bold text-syn-gold tracking-wider uppercase mb-1.5">Priority Focus</p>
          <h3 class="text-syn-cream font-semibold text-[15px] mb-2 leading-snug">Optimizing Net Profit via OpEx Reduction</h3>
          <p class="text-sm text-syn-muted leading-relaxed">
            Based on Pareto's Principle, 80% of your costs come from 20% of logistics. Re-routing local deliveries within the 5km high-demand radius could increase Net Profit by <span class="font-semibold text-syn-accent">4.2%</span>.
          </p>
        </div>

        <div class="h-px w-full bg-syn-border"></div>

        <!-- Advice Item 2 -->
        <div>
          <p class="text-[10px] font-bold text-syn-accent tracking-wider uppercase mb-1.5">Growth Strategy</p>
          <h3 class="text-syn-cream font-semibold text-[15px] mb-2 leading-snug">Revenue Stream Expansion</h3>
          <p class="text-sm text-syn-muted leading-relaxed">
            Your current inventory turnover for 'UltraBook Pro' suggests an untapped subscription model opportunity for enterprise clients.
          </p>
        </div>
      </div>

      <div class="p-4 border-t border-syn-border bg-syn-darker/50 backdrop-blur-sm">
        <button class="w-full bg-syn-accent hover:bg-syn-gold text-syn-darker font-bold text-sm py-2.5 rounded-xl transition-colors shadow-sm">
          Generate Full Audit
        </button>
      </div>
    </div>
  </div>
</template>
