<template>
  <!-- Financial Intelligence -->
  <section id="erp" class="py-32 relative bg-syn-darker">
      <div class="max-w-7xl mx-auto px-6">
          <div class="text-center mb-20">
              <h2 class="font-display text-4xl md:text-6xl mb-6 finance-title">Financial Intelligence</h2>
              <p class="text-syn-muted max-w-2xl mx-auto text-lg finance-desc">
                  Manajemen bisnis komprehensif dari operasional hingga finansial. Kami bantu klasifikasi Revenue stream, 
                  Total Cost, dan Operational Cost untuk memberikan <span class="text-syn-accent">saran finansial AI yang cerdas</span> baik untuk bisnis 
                  maupun personal finance Anda.
              </p>
          </div>

          <div class="grid md:grid-cols-3 gap-6">
              <!-- Card 1 -->
              <div class="finance-card glass-card rounded-3xl p-8 relative overflow-hidden group">
                  <div class="absolute top-0 right-0 w-32 h-32 bg-syn-accent/10 rounded-full blur-3xl group-hover:bg-syn-accent/20 transition-all duration-500"></div>
                  <div class="relative z-10">
                      <div class="w-14 h-14 rounded-2xl bg-linear-to-br from-syn-accent/20 to-transparent flex items-center justify-center mb-6 border border-syn-accent/20">
                          <svg class="w-7 h-7 text-syn-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                      </div>
                      <h3 class="font-display text-2xl mb-3">Comprehensive Tracking</h3>
                      <p class="text-syn-muted text-sm leading-relaxed mb-6">
                          Pantau secara presisi pergerakan Revenue Stream, Total Cost, hingga Operational Cost dengan dashboard real-time.
                      </p>
                  </div>
              </div>

              <!-- Card 2 -->
              <div class="finance-card glass-card rounded-3xl p-8 relative overflow-hidden group md:translate-y-8">
                  <div class="absolute top-0 right-0 w-32 h-32 bg-syn-gold/10 rounded-full blur-3xl group-hover:bg-syn-gold/20 transition-all duration-500"></div>
                  <div class="relative z-10">
                      <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-syn-gold/20 to-transparent flex items-center justify-center mb-6 border border-syn-gold/20">
                          <svg class="w-7 h-7 text-syn-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      </div>
                      <h3 class="font-display text-2xl mb-3">AI Financial Advisor</h3>
                      <p class="text-syn-muted text-sm leading-relaxed mb-6">
                          Dapatkan "Actionable Advice" dari AI berdasarkan kondisi nyata margin net profit bisnis dan tujuan personal finance harian Anda.
                      </p>
                  </div>
              </div>

              <!-- Card 3 -->
              <div class="finance-card glass-card rounded-3xl p-8 relative overflow-hidden group">
                  <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500"></div>
                  <div class="relative z-10">
                      <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-transparent flex items-center justify-center mb-6 border border-purple-500/20">
                          <svg class="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </div>
                      <h3 class="font-display text-2xl mb-3">Profit Clarity</h3>
                      <p class="text-syn-muted text-sm leading-relaxed mb-6">
                          Berdasarkan berbagai teori keuangan yang disederhanakan, ketahui persis arus kas demi menjaga sustainability bisnis.
                      </p>
                  </div>
              </div>
          </div>

          <!-- Dashboard Preview -->
          <div class="mt-20 relative finance-dashboard">
              <div class="absolute inset-0 bg-gradient-to-t from-syn-darker via-transparent to-transparent z-10 pointer-events-none"></div>
              <div class="glass-card rounded-3xl p-2 md:p-4 glow-border dashboard-wrapper">
                  <div class="bg-syn-dark rounded-2xl p-6 md:p-8 overflow-hidden">
                      
                      <!-- AI Advice Box -->
                      <div class="mb-6 p-4 rounded-xl bg-syn-accent/10 border border-syn-accent/20 flex gap-4 dashboard-advice opacity-0 transform translate-y-4">
                          <div class="w-10 h-10 rounded-full bg-syn-accent/20 flex items-center justify-center shrink-0 text-syn-accent">
                              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                          </div>
                          <div>
                              <h4 class="text-syn-accent font-display text-sm mb-1">SynAI Advisor</h4>
                              <p class="text-sm text-syn-cream/80">
                                  Operational cost bulan ini meningkat 12%. Saran: Lakukan evaluasi supplier di komunitas radius 3km untuk cut margin pengeluaran. Sisihkan 15% dari estimasi net profit (Rp 14.3jt) untuk personal dana darurat Anda.
                              </p>
                          </div>
                      </div>

                      <div class="grid md:grid-cols-4 gap-6 mb-8">
                          <div class="md:col-span-3">
                              <div class="h-64 bg-white/5 rounded-2xl flex items-end justify-between p-6 gap-2">
                                  <div class="w-full bg-syn-accent/20 rounded-t-lg h-[40%] relative group chart-bar transform origin-bottom scale-y-0">
                                      <div class="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-syn-accent opacity-0 group-hover:opacity-100 transition-opacity">Jan</div>
                                  </div>
                                  <div class="w-full bg-syn-accent/30 rounded-t-lg h-[60%] relative group chart-bar transform origin-bottom scale-y-0">
                                      <div class="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-syn-accent opacity-0 group-hover:opacity-100 transition-opacity">Feb</div>
                                  </div>
                                  <div class="w-full bg-syn-accent/40 rounded-t-lg h-[45%] relative group chart-bar transform origin-bottom scale-y-0">
                                      <div class="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-syn-accent opacity-0 group-hover:opacity-100 transition-opacity">Mar</div>
                                  </div>
                                  <div class="w-full bg-syn-accent/50 rounded-t-lg h-[80%] relative group chart-bar transform origin-bottom scale-y-0">
                                      <div class="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-syn-accent opacity-0 group-hover:opacity-100 transition-opacity">Apr</div>
                                  </div>
                                  <div class="w-full bg-syn-accent/60 rounded-t-lg h-[70%] relative group chart-bar transform origin-bottom scale-y-0">
                                      <div class="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-syn-accent opacity-0 group-hover:opacity-100 transition-opacity">Mei</div>
                                  </div>
                                  <div class="w-full bg-syn-accent rounded-t-lg h-[90%] relative group chart-bar transform origin-bottom scale-y-0">
                                      <div class="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-syn-accent opacity-0 group-hover:opacity-100 transition-opacity">Jun</div>
                                  </div>
                              </div>
                          </div>
                          <div class="space-y-4">
                              <div class="bg-white/5 rounded-xl p-4 dashboard-stat opacity-0 transform translate-x-4">
                                  <div class="text-xs text-syn-muted mb-1">Revenue Stream</div>
                                  <div class="font-display text-2xl text-syn-accent">Rp 42.8jt</div>
                              </div>
                              <div class="bg-white/5 rounded-xl p-4 dashboard-stat opacity-0 transform translate-x-4">
                                  <div class="text-xs text-syn-muted mb-1">Total Cost (Op + COGS)</div>
                                  <div class="font-display text-2xl text-orange-400">Rp 28.5jt</div>
                              </div>
                              <div class="bg-syn-accent/10 rounded-xl p-4 border border-syn-accent/20 dashboard-stat opacity-0 transform translate-x-4">
                                  <div class="text-xs text-syn-muted mb-1">Net Profit</div>
                                  <div class="font-display text-2xl text-syn-gold">Rp 14.3jt</div>
                                  <div class="text-xs text-green-400 mt-1">+18% Margin</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
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

    // Financial Intelligence section Animations
    const tlFinance = gsap.timeline({
        scrollTrigger: {
            trigger: '#erp',
            start: 'top 80%',
        }
    });

    tlFinance.from('.finance-title', { y: 30, opacity: 0, duration: 0.6 })
             .from('.finance-desc', { y: 30, opacity: 0, duration: 0.6 }, "-=0.4")
             .from('.finance-card', { y: 50, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" }, "-=0.2");

    // Dashboard Preview Animation  
    const tlDashboard = gsap.timeline({
        scrollTrigger: {
            trigger: '.finance-dashboard',
            start: 'top 75%',
        }
    });

    tlDashboard.from('.dashboard-wrapper', { y: 60, opacity: 0, duration: 0.8, ease: "power3.out" })
               .to('.dashboard-advice', { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }, "-=0.2")
               .to('.chart-bar', { scaleY: 1, duration: 0.8, stagger: 0.1, ease: "elastic.out(1, 0.7)" }, "-=0.2")
               .to('.dashboard-stat', { x: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power2.out" }, "-=0.6");
  }
  
  setTimeout(initAnimations, 100);
})
</script>
