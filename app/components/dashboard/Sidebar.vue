<template>
  <aside class="w-64 bg-syn-darker border-r border-syn-border h-screen flex flex-col pt-6 pb-6 px-4 shrink-0 font-sans sticky top-0">
    <!-- Logo -->
    <div class="flex items-center gap-3 px-2 mb-10">
      <div class="w-10 h-10 bg-syn-accent/20 border border-syn-accent/30 rounded-xl flex items-center justify-center shrink-0">
        <Icon name="heroicons:square-3-stack-3d" class="w-6 h-6 text-syn-accent" />
      </div>
      <div>
        <h1 class="text-white font-semibold text-lg leading-tight tracking-wide">Synconomics</h1>
        <p class="text-[11px] text-syn-muted tracking-wide">Enterprise OS</p>
      </div>
    </div>

    <!-- Nav Items -->
    <nav class="flex-1 space-y-1.5 mt-2">
      <NuxtLink 
        to="/dashboard" 
        exact-active-class="bg-syn-accent/10 border border-syn-accent/20 text-syn-accent" 
        class="flex items-center gap-3 px-3 py-2.5 text-syn-muted hover:text-syn-cream hover:bg-syn-surface border border-transparent rounded-lg transition-all group"
      >
        <Icon name="heroicons:squares-2x2-solid" class="w-5 h-5 group-[.router-link-exact-active]:text-syn-accent" />
        <span class="font-medium text-[15px]">Dashboard</span>
      </NuxtLink>
      
      <NuxtLink 
        to="/dashboard/inventory" 
        exact-active-class="bg-syn-accent/10 border border-syn-accent/20 text-syn-accent" 
        class="flex items-center gap-3 px-3 py-2.5 text-syn-muted hover:text-syn-cream hover:bg-syn-surface border border-transparent rounded-lg transition-all group"
      >
        <Icon name="heroicons:archive-box" class="w-5 h-5 group-hover:text-syn-cream group-[.router-link-exact-active]:text-syn-accent transition-colors" />
        <span class="font-medium text-[15px]">Inventory</span>
      </NuxtLink>
      
      <NuxtLink 
        to="/dashboard/finance" 
        exact-active-class="bg-syn-accent/10 border border-syn-accent/20 text-syn-accent" 
        class="flex items-center gap-3 px-3 py-2.5 text-syn-muted hover:text-syn-cream hover:bg-syn-surface border border-transparent rounded-lg transition-all group"
      >
        <Icon name="heroicons:banknotes" class="w-5 h-5 group-hover:text-syn-cream group-[.router-link-exact-active]:text-syn-accent transition-colors" />
        <span class="font-medium text-[15px]">Finance</span>
      </NuxtLink>
      
      <NuxtLink 
        to="/dashboard/community" 
        exact-active-class="bg-syn-accent/10 border border-syn-accent/20 text-syn-accent" 
        class="flex items-center gap-3 px-3 py-2.5 text-syn-muted hover:text-syn-cream hover:bg-syn-surface border border-transparent rounded-lg transition-all group"
      >
        <Icon name="heroicons:user-group" class="w-5 h-5 group-hover:text-syn-cream group-[.router-link-exact-active]:text-syn-accent transition-colors" />
        <span class="font-medium text-[15px]">Community</span>
      </NuxtLink>
      
      <NuxtLink 
        to="/business" 
        exact-active-class="bg-syn-accent/10 border border-syn-accent/20 text-syn-accent" 
        class="flex items-center gap-3 px-3 py-2.5 text-syn-muted hover:text-syn-cream hover:bg-syn-surface border border-transparent rounded-lg transition-all group"
      >
        <Icon name="heroicons:building-storefront" class="w-5 h-5 group-hover:text-syn-cream group-[.router-link-exact-active]:text-syn-accent transition-colors" />
        <span class="font-medium text-[15px]">Business</span>
      </NuxtLink>

      <NuxtLink 
        to="/ai/chat" 
        exact-active-class="bg-syn-accent/10 border border-syn-accent/20 text-syn-accent" 
        class="flex items-center gap-3 px-3 py-2.5 text-syn-muted hover:text-syn-cream hover:bg-syn-surface border border-transparent rounded-lg transition-all group"
      >
        <Icon name="heroicons:sparkles" class="w-5 h-5 group-hover:text-syn-cream group-[.router-link-exact-active]:text-syn-accent transition-colors" />
        <span class="font-medium text-[15px]">AI Mentor</span>
      </NuxtLink>

      <!-- Preferences -->
      <div class="pt-8 pb-2 px-3">
        <p class="text-[10px] font-bold text-syn-muted tracking-wider uppercase">Preferences</p>
      </div>
      <NuxtLink 
        to="/dashboard/settings" 
        exact-active-class="bg-syn-accent/10 border border-syn-accent/20 text-syn-accent" 
        class="flex items-center gap-3 px-3 py-2.5 text-syn-muted hover:text-syn-cream hover:bg-syn-surface border border-transparent rounded-lg transition-all group"
      >
        <Icon name="heroicons:cog-8-tooth" class="w-5 h-5 group-hover:text-syn-cream group-[.router-link-exact-active]:text-syn-accent transition-colors" />
        <span class="font-medium text-[15px]">Settings</span>
      </NuxtLink>
    </nav>
  </aside>
</template>
