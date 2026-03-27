<script setup lang="ts">
import { useState } from '#imports';
import { watch } from 'vue';
import { useRoute } from 'vue-router';

const isSidebarOpen = useState('isSidebarOpen', () => false);
const route = useRoute();

// Auto close sidebar on route change in mobile
watch(() => route.path, () => {
  isSidebarOpen.value = false;
});
</script>

<template>
  <aside 
    :class="[
      'w-64 bg-syn-darker md:border-r border-syn-border h-screen flex flex-col pt-6 pb-6 px-4 shrink-0 font-sans z-50 transition-transform duration-300',
      'fixed inset-y-0 left-0 md:relative md:translate-x-0',
      isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center justify-between px-2 mb-10">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-syn-accent/20 border border-syn-accent/30 rounded-xl flex items-center justify-center shrink-0">
          <Icon name="heroicons:square-3-stack-3d" class="w-6 h-6 text-syn-accent" />
        </div>
        <div>
          <h1 class="text-white font-semibold text-lg leading-tight tracking-wide">Synconomics</h1>
          <p class="text-[11px] text-syn-muted tracking-wide">Sistem Bisnis</p>
        </div>
      </div>
      <!-- Close Button Mobile Only -->
      <button @click="isSidebarOpen = false" class="md:hidden text-syn-muted hover:text-white p-2">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <!-- Nav Items -->
    <nav class="flex-1 space-y-1.5 mt-2">
      <NuxtLink
        to="/dashboard"
        exact-active-class="bg-syn-accent/10 border border-syn-accent/20 text-syn-accent"
        class="flex items-center gap-3 px-3 py-2.5 text-syn-muted hover:text-syn-cream hover:bg-syn-surface border border-transparent rounded-lg transition-all group"
      >
        <Icon name="heroicons:squares-2x2-solid" class="w-5 h-5 group-[.router-link-exact-active]:text-syn-accent" />
        <span class="font-medium text-[15px]">Dasbor</span>
      </NuxtLink>

      <NuxtLink
        to="/dashboard/inventory"
        exact-active-class="bg-syn-accent/10 border border-syn-accent/20 text-syn-accent"
        class="flex items-center gap-3 px-3 py-2.5 text-syn-muted hover:text-syn-cream hover:bg-syn-surface border border-transparent rounded-lg transition-all group"
      >
        <Icon name="heroicons:archive-box" class="w-5 h-5 group-hover:text-syn-cream group-[.router-link-exact-active]:text-syn-accent transition-colors" />
        <span class="font-medium text-[15px]">Inventaris</span>
      </NuxtLink>

      <NuxtLink
        to="/dashboard/finance"
        exact-active-class="bg-syn-accent/10 border border-syn-accent/20 text-syn-accent"
        class="flex items-center gap-3 px-3 py-2.5 text-syn-muted hover:text-syn-cream hover:bg-syn-surface border border-transparent rounded-lg transition-all group"
      >
        <Icon name="heroicons:banknotes" class="w-5 h-5 group-hover:text-syn-cream group-[.router-link-exact-active]:text-syn-accent transition-colors" />
        <span class="font-medium text-[15px]">Keuangan</span>
      </NuxtLink>

      <NuxtLink
        to="/dashboard/community"
        exact-active-class="bg-syn-accent/10 border border-syn-accent/20 text-syn-accent"
        class="flex items-center gap-3 px-3 py-2.5 text-syn-muted hover:text-syn-cream hover:bg-syn-surface border border-transparent rounded-lg transition-all group"
      >
        <Icon name="heroicons:user-group" class="w-5 h-5 group-hover:text-syn-cream group-[.router-link-exact-active]:text-syn-accent transition-colors" />
        <span class="font-medium text-[15px]">Komunitas</span>
      </NuxtLink>

      <NuxtLink
        to="/dashboard/business"
        exact-active-class="bg-syn-accent/10 border border-syn-accent/20 text-syn-accent"
        class="flex items-center gap-3 px-3 py-2.5 text-syn-muted hover:text-syn-cream hover:bg-syn-surface border border-transparent rounded-lg transition-all group"
      >
        <Icon name="heroicons:building-storefront" class="w-5 h-5 group-hover:text-syn-cream group-[.router-link-exact-active]:text-syn-accent transition-colors" />
        <span class="font-medium text-[15px]">Bisnis</span>
      </NuxtLink>

      <NuxtLink
        to="/dashboard/supply"
        @click.prevent="navigateTo('/dashboard/supply', { external: true })"
        exact-active-class="bg-syn-accent/10 border border-syn-accent/20 text-syn-accent"
        class="flex items-center gap-3 px-3 py-2.5 text-syn-muted hover:text-syn-cream hover:bg-syn-surface border border-transparent rounded-lg transition-all group"
      >
        <Icon name="heroicons:map" class="w-5 h-5 group-hover:text-syn-cream group-[.router-link-exact-active]:text-syn-accent transition-colors" />
        <span class="font-medium text-[15px]">Jaringan Suplai</span>
      </NuxtLink>



      <NuxtLink
        to="/dashboard/audit"
        exact-active-class="bg-syn-accent/10 border border-syn-accent/20 text-syn-accent"
        class="flex items-center gap-3 px-3 py-2.5 text-syn-muted hover:text-syn-cream hover:bg-syn-surface border border-transparent rounded-lg transition-all group"
      >
        <Icon name="heroicons:document-magnifying-glass" class="w-5 h-5 group-hover:text-syn-cream group-[.router-link-exact-active]:text-syn-accent transition-colors" />
        <span class="font-medium text-[15px]">Audit AI</span>
      </NuxtLink>

      <NuxtLink
        to="/ai/chat"
        exact-active-class="bg-syn-accent/10 border border-syn-accent/20 text-syn-accent"
        class="flex items-center gap-3 px-3 py-2.5 text-syn-muted hover:text-syn-cream hover:bg-syn-surface border border-transparent rounded-lg transition-all group"
      >
        <Icon name="heroicons:sparkles" class="w-5 h-5 group-hover:text-syn-cream group-[.router-link-exact-active]:text-syn-accent transition-colors" />
        <span class="font-medium text-[15px]">Mentor AI</span>
      </NuxtLink>

      <!-- Preferences -->
      <div class="pt-8 pb-2 px-3">
        <p class="text-[10px] font-bold text-syn-muted tracking-wider uppercase">Pengaturan</p>
      </div>
      <NuxtLink
        to="/dashboard/profile"
        exact-active-class="bg-syn-accent/10 border border-syn-accent/20 text-syn-accent"
        class="flex items-center gap-3 px-3 py-2.5 text-syn-muted hover:text-syn-cream hover:bg-syn-surface border border-transparent rounded-lg transition-all group"
      >
        <Icon name="heroicons:cog-8-tooth" class="w-5 h-5 group-hover:text-syn-cream group-[.router-link-exact-active]:text-syn-accent transition-colors" />
        <span class="font-medium text-[15px]">Profil</span>
      </NuxtLink>
    </nav>
  </aside>
</template>
