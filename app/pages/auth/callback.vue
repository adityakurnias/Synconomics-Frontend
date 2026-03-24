<template>
  <div class="flex items-center justify-center min-h-screen hero-gradient">
    <div class="glass-card p-10 rounded-3xl text-center border border-white/10 bg-white/5">
      <div class="w-12 h-12 border-4 border-syn-accent/30 border-t-syn-accent rounded-full animate-spin mx-auto mb-6"></div>
      <h2 class="font-display text-2xl text-white tracking-tight">Memproses Login...</h2>
      <p class="text-syn-muted mt-2 text-sm">Mohon tunggu, kami sedang mengamankan sesi Anda.</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'

const route = useRoute()
const { token } = useAuth()

definePageMeta({
  path: '/callback'
})

onMounted(() => {
  const queryToken = route.query.token as string

  if (queryToken) {
    token.value = queryToken

    setTimeout(() => {
        navigateTo('/dashboard')
    }, 1000) 
  } else {
    navigateTo('/auth/login')
  }
})
</script>
