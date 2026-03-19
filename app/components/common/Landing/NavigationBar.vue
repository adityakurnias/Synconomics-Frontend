<template>
  <nav class="fixed top-0 w-full z-50 px-6 py-6 mix-blend-difference">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-full border border-syn-accent/30 flex items-center justify-center"
        >
          <span class="font-display font-bold text-syn-accent text-lg">S</span>
        </div>
        <span class="font-display text-xl tracking-tight text-white"
          >Synconomics</span
        >
      </div>

      <div
        class="hidden md:flex items-center gap-8 font-sans text-sm tracking-wide"
      >
        <a
          href="#ecosystem"
          class="hover:text-syn-accent transition-colors duration-300"
          >Ekosistem</a
        >
        <a
          href="#ai-mentor"
          class="hover:text-syn-accent transition-colors duration-300"
          >AI Mentor</a
        >
        <a
          href="#erp"
          class="hover:text-syn-accent transition-colors duration-300"
          >ERP</a
        >
        <a
          href="#community"
          class="hover:text-syn-accent transition-colors duration-300"
          >Komunitas</a
        >
      </div>
      <a href="/auth/login">
        <button
          class="magnetic-btn px-6 py-3 border border-syn-accent/50 rounded-full text-sm font-medium hover:bg-syn-accent hover:text-syn-dark transition-all duration-500"
        >
          Early Access
        </button>
      </a>
    </div>
  </nav>
</template>

<script lang="ts" setup></script>

<style></style>
