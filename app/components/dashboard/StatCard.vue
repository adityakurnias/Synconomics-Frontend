<template>
  <div class="bg-syn-dark border border-syn-border rounded-2xl p-5 hover:border-syn-border-hover transition-colors group cursor-default">
    <div class="flex items-start justify-between mb-4">
      <div :class="`w-10 h-10 rounded-xl flex items-center justify-center bg-syn-${iconColor}/10 text-syn-${iconColor} group-hover:scale-105 transition-transform`">
        <Icon :name="icon" class="w-5 h-5" />
      </div>
      <div :class="`px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 ${trend > 0 ? 'text-syn-success bg-syn-success/10' : 'text-syn-danger bg-syn-danger/10'}`">
        <Icon :name="trend > 0 ? 'heroicons:arrow-up-right' : 'heroicons:arrow-down-right'" class="w-3 h-3" />
        {{ Math.abs(trend) }}%
      </div>
    </div>
    
    <div>
      <p class="text-xs text-syn-muted font-medium mb-1.5">{{ title }}</p>
      <h3 class="text-2xl font-semibold text-white tracking-tight">{{ value }}</h3>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  trend: Number,
  icon: String,
  iconColor: {
    type: String,
    default: 'accent'
  }
})
</script>
