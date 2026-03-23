<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient pt-24">
      <!-- Background Orbs -->
      <div class="orb w-96 h-96 bg-syn-accent/20 top-20 -left-20"></div>
      <div class="orb w-64 h-64 bg-syn-gold/10 bottom-20 right-20 animation-delay-2000"></div>
      
      <div class="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div class="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs tracking-widest uppercase text-syn-accent">
              <span class="w-2 h-2 rounded-full bg-syn-accent animate-pulse"></span>
              Ekonomi Terdistribusi + AI
          </div>
          
          <h1 class="font-display text-6xl md:text-8xl lg:text-9xl font-medium leading-[0.9] mb-8 tracking-tight">
              <span class="block overflow-hidden">
                  <span class="split-line inline-block">Sinergi</span>
              </span>
              <span class="block overflow-hidden text-syn-accent/80 italic font-serif">
                  <span class="split-line inline-block">Bisnis Lokal</span>
              </span>
          </h1>
          
          <p class="max-w-2xl mx-auto text-lg md:text-xl text-syn-cream/70 font-light leading-relaxed mb-12">
              Platform ERP pertama dengan AI Business Mentor yang memetakan ekosistem ekonomi dalam radius 1km. 
              Dari ide hingga profit, terhubung dengan komunitas bisnis terdekat.
          </p>
          
          <div class="flex flex-col md:flex-row gap-4 justify-center items-center">
              <a href="/auth/register">
                  <button class="magnetic-btn group relative px-8 py-4 bg-syn-accent text-syn-dark rounded-full font-display font-medium text-lg overflow-hidden">
                      <span class="relative z-10">Daftar Sekarang</span>
                      <div class="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                  </button>
              </a>
              <button class="magnetic-btn px-8 py-4 border border-white/20 rounded-full font-display hover:border-syn-accent transition-colors duration-300 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Lihat Demo
              </button>
          </div>

          <div class="mt-24 scroll-indicator">
              <svg class="w-6 h-6 mx-auto text-syn-accent/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
          </div>
      </div>

      <!-- Floating Stats -->
      <div class="absolute bottom-10 left-6 md:left-20 glass-card p-4 rounded-2xl hidden md:block transform hover:scale-105 transition-transform duration-500">
          <div class="text-xs text-syn-muted uppercase tracking-wider mb-1">Radius Komunitas</div>
          <div class="font-display text-2xl text-syn-accent">1-5 km</div>
      </div>
      
      <div class="absolute top-1/3 right-6 md:right-20 glass-card p-4 rounded-2xl hidden md:block transform hover:scale-105 transition-transform duration-500">
          <div class="text-xs text-syn-muted uppercase tracking-wider mb-1">AI Model</div>
          <div class="font-display text-2xl text-syn-gold">GPT-4o</div>
      </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  const initAnimations = () => {
    if (typeof (window as any).gsap === 'undefined') return setTimeout(initAnimations, 100);
    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animation
    gsap.from('.split-line', {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out"
    });

    // Parallax for Orbs
    gsap.to('.orb', {
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        },
        y: 200,
        rotation: 180
    });
  }
  
  setTimeout(initAnimations, 100);
})
</script>
