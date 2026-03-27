<template>
  <div class="bg-syn-dark border border-syn-border rounded-2xl p-5 hover:border-syn-border-hover transition-colors group cursor-default">
    <div class="flex items-start justify-between mb-4">
      <div :class="`w-10 h-10 rounded-xl flex items-center justify-center bg-syn-${iconColor}/10 text-syn-${iconColor} group-hover:scale-105 transition-transform`">
        <Icon :name="icon" class="w-5 h-5" />
      </div>
      <div :class="`px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1 ${trendColorClass}`">
        <Icon :name="trendIcon" class="w-3 h-3" />
        {{ formattedTrend }}%
      </div>
    </div>
    
    <div>
      <p class="text-xs text-syn-muted font-medium mb-1.5">{{ title }}</p>
      <h3 class="text-2xl font-semibold text-white tracking-tight">{{ value }}</h3>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  value: String,
  trend: Number,
  icon: String,
  iconColor: {
    type: String,
    default: 'accent'
  },
  invertTrend: {
    type: Boolean,
    default: false
  }
})

const formattedTrend = computed(() => {
  return Math.abs(props.trend).toFixed(1).replace(/\.0$/, '')
})

const isPositive = computed(() => props.trend > 0)

// For cost/expense cards, up is bad (red) and down is good (green)
const isGood = computed(() => props.invertTrend ? !isPositive.value : isPositive.value)

const trendColorClass = computed(() => {
  if (props.trend === 0) return 'text-syn-muted bg-syn-muted/10'
  return isGood.value ? 'text-syn-success bg-syn-success/10' : 'text-syn-danger bg-syn-danger/10'
})

const trendIcon = computed(() => {
  if (props.trend === 0) return 'heroicons:minus'
  return isPositive.value ? 'heroicons:arrow-up-right' : 'heroicons:arrow-down-right'
})
</script>
