<template>
  <header class="flex items-center justify-between h-20 px-8 border-b border-syn-border bg-syn-dark/80 backdrop-blur-md sticky top-0 z-40">
    <!-- <div class="flex-1 max-w-xl relative">
      <Icon name="heroicons:magnifying-glass" class="w-4 h-4 text-syn-muted absolute left-4 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        placeholder="Search products, orders, or insights..."
        class="w-full bg-syn-darker border border-syn-border rounded-xl py-2.5 pl-11 pr-4 text-sm text-syn-cream placeholder-syn-muted focus:outline-none focus:border-syn-accent/30 focus:ring-1 focus:ring-syn-accent/30 transition-all"
      />
    </div> -->

    <div class="flex items-center gap-5 ml-auto">
      <!-- <button class="w-10 h-10 rounded-full border border-syn-border flex items-center justify-center text-syn-muted hover:text-syn-cream hover:bg-syn-surface transition-all relative">
        <Icon name="heroicons:bell" class="w-5 h-5" />
        <span class="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-syn-gold rounded-full border border-syn-dark"></span>
      </button> -->

      <NuxtLink to="/dashboard/profile" class="flex items-center gap-3 group">
        <div class="text-right hidden sm:block">
          <p class="text-xs font-semibold text-syn-cream group-hover:text-syn-accent transition-colors">{{ user?.name || 'User' }}</p>
          <p class="text-[10px] text-syn-muted group-hover:text-syn-muted/80">{{ user?.role || 'Entrepreneur' }}</p>
        </div>
        <div class="w-10 h-10 rounded-full overflow-hidden border border-syn-border group-hover:border-syn-accent/50 transition-colors">
          <img :src="avatarUrl" alt="Profile" class="w-full h-full object-cover" />
        </div>
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

const config = useRuntimeConfig();
const { user, FetchProfile } = useAuth();

const avatarUrl = computed(() => {
  if (user.value?.avatar) {
    if (user.value.avatar.startsWith('http')) {
      return user.value.avatar;
    }
    const path = user.value.avatar.startsWith('/') ? user.value.avatar : `/${user.value.avatar}`;
    return `${config.public.apiBase}${path}`;
  }
  const nameForAvatar = user.value?.name || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nameForAvatar)}&background=10B981&color=fff&size=100`;
});

onMounted(async () => {
  if (!user.value) {
    await FetchProfile();
  }
});
</script>
