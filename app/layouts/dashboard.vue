<script setup lang="ts">
import { useState } from '#imports';

const isSidebarOpen = useState('isSidebarOpen', () => false);

const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>

<template>
  <div class="min-h-screen bg-syn-darker flex flex-col md:flex-row text-syn-cream font-sans relative overflow-x-hidden">
    <!-- Mobile overlay -->
    <div 
      v-if="isSidebarOpen" 
      @click="closeSidebar"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
    ></div>
    <DashboardSidebar />
    
    <main class="flex-1 flex flex-col min-w-0 h-screen">
      <DashboardTopNav />

      <div class="flex-1 overflow-y-auto p-4 sm:p-8 relative border-t border-syn-border">
        <!-- Background Grain/Gradient -->
        <div class="absolute inset-0 pointer-events-none">
          <div class="grain-overlay"></div>
          <div class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-125 hero-gradient opacity-30"></div>
        </div>

        <div class="max-w-350 mx-auto relative z-10 w-full">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>
