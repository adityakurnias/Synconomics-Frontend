<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="font-display text-4xl mb-2 text-syn-accent">Business Profile</h1>
        <p class="text-syn-muted">Kelola profil usaha dan informasi bisnis Anda.</p>
      </div>
      <button 
        v-if="!isLoading && businesses.length === 0"
        @click="openCreateModal"
        class="px-6 py-3 bg-syn-accent text-syn-dark rounded-full font-display font-medium hover:bg-white transition-colors">
        + Tambah Bisnis
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading || isFetchingDetail" class="flex justify-center items-center py-20">
      <div class="w-10 h-10 border-4 border-syn-accent border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Error State -->
    <div v-if="error || detailError" class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 mb-6">
      {{ error || detailError }}
    </div>

    <!-- Empty State -->
    <div v-if="!isLoading && !isFetchingDetail && businesses.length === 0" class="text-center py-20 glass-card rounded-3xl">
      <div class="w-20 h-20 rounded-full bg-syn-accent/10 flex items-center justify-center mx-auto mb-6 text-syn-accent">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
      </div>
      <h3 class="font-display text-2xl mb-2">Belum Ada Bisnis</h3>
      <p class="text-syn-muted mb-6">Mulai dengan mendaftarkan profil bisnis pertama Anda.</p>
    </div>

    <!-- Single Business Dashboard -->
    <template v-else-if="!isLoading && !isFetchingDetail && businesses.length > 0 && currentActiveBusiness">
      <div class="grid lg:grid-cols-3 gap-8">
        
        <!-- Left Column: Business Profile Card -->
        <div class="lg:col-span-1 space-y-6">
          <div class="glass-card p-8 rounded-3xl glow-border relative overflow-hidden group">
            <div class="absolute -top-20 -right-20 w-48 h-48 bg-syn-accent/10 rounded-full blur-3xl group-hover:bg-syn-accent/20 transition-all"></div>
            
            <div class="flex flex-col items-center text-center relative z-10 mb-6">
              <div class="w-28 h-28 rounded-2xl bg-white/5 overflow-hidden border border-white/10 shrink-0 mb-4 shadow-2xl flex items-center justify-center text-syn-muted">
                <img v-if="currentActiveBusiness.logo_url" :src="currentActiveBusiness.logo_url.startsWith('http') ? currentActiveBusiness.logo_url : 'https://api-synconomics.synchronizeteams.com/' + currentActiveBusiness.logo_url" class="w-full h-full object-cover" />
                <svg v-else class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L28 20M6 12a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
              <h2 class="font-display text-3xl leading-tight mb-2 group-hover:text-syn-accent transition-colors">{{ currentActiveBusiness.name }}</h2>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-syn-accent/10 text-syn-accent border border-syn-accent/20 rounded-full text-sm font-medium">
                {{ currentActiveBusiness.category }}
              </span>
            </div>

            <div class="space-y-4 pt-6 border-t border-white/10 relative z-10">
              <div class="flex flex-col">
                <span class="text-xs text-syn-muted uppercase tracking-wider font-semibold mb-1">Deskripsi</span>
                <p class="text-sm text-syn-cream/80">{{ currentActiveBusiness.description || 'Tidak ada deskripsi' }}</p>
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-syn-muted uppercase tracking-wider font-semibold mb-1">Alamat</span>
                <p class="text-sm text-syn-cream/80 flex items-start gap-2">
                  <svg class="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {{ currentActiveBusiness.address || 'Alamat belum diatur' }}
                </p>
              </div>
              <div class="flex flex-col">
                <span class="text-xs text-syn-muted uppercase tracking-wider font-semibold mb-1">Kontak</span>
                <div class="flex flex-col gap-2 text-sm text-syn-cream/80">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 shrink-0 text-syn-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    {{ currentActiveBusiness.phone || 'Nomor telepon belum diatur' }}
                  </div>
                  <a v-if="currentActiveBusiness.whatsapp" :href="`https://wa.me/${currentActiveBusiness.whatsapp.replace(/\\D/g, '').replace(/^0/, '62')}`" target="_blank" class="flex items-center gap-2 hover:text-green-400 transition-colors">
                    <Icon name="mdi:whatsapp" class="w-4 h-4 shrink-0" />
                    WhatsApp
                  </a>
                  <a v-if="currentActiveBusiness.instagram" :href="`https://instagram.com/${currentActiveBusiness.instagram.replace('@', '').split('/').pop()}`" target="_blank" class="flex items-center gap-2 hover:text-pink-400 transition-colors">
                    <Icon name="mdi:instagram" class="w-4 h-4 shrink-0" />
                    Instagram
                  </a>
                  <a v-if="currentActiveBusiness.tiktok" :href="`https://tiktok.com/@${currentActiveBusiness.tiktok.replace('@', '').split('/').pop()}`" target="_blank" class="flex items-center gap-2 hover:text-white transition-colors">
                    <Icon name="bi:tiktok" class="w-4 h-4 shrink-0" />
                    TikTok
                  </a>
                  <a v-if="currentActiveBusiness.website" :href="currentActiveBusiness.website.startsWith('http') ? currentActiveBusiness.website : `https://${currentActiveBusiness.website}`" target="_blank" class="flex items-center gap-2 hover:text-blue-400 transition-colors">
                    <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                    Kunjungi Website
                  </a>
                </div>
              </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="mt-8 pt-6 border-t border-white/10 flex gap-3 relative z-10">
              <button @click="editBusiness(currentActiveBusiness)" class="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                Edit
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column: Scores & Metrics -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Score Section -->
          <div class="glass-card p-8 rounded-3xl glow-border relative overflow-hidden">
             <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
             <h3 class="font-display text-2xl mb-6 relative z-10 flex items-center gap-3">
               <span class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
               </span>
               Business Score
             </h3>

             <div v-if="score" class="relative z-10 flex flex-col sm:flex-row items-center gap-8">
                <!-- Large Score Circle -->
                <div class="relative w-40 h-40 shrink-0 flex items-center justify-center">
                  <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="8"></circle>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="8" class="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" :stroke-dasharray="`${(score.score || 0) * 2.827} 282.7`" stroke-linecap="round"></circle>
                  </svg>
                  <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="font-display text-4xl font-bold text-white">{{ score.score || 0 }}</span>
                    <span class="text-xs text-syn-muted">/ 100</span>
                  </div>
                </div>

                <div class="flex-1 w-full space-y-4">
                  <p class="text-syn-cream/80 text-sm leading-relaxed">
                    {{ score.notes || 'Hasil evaluasi bisnis ini menunjukkan performa yang cukup stabil dengan ruang untuk beberapa perbaikan di masa depan.' }}
                  </p>
                  
                  <div class="flex flex-wrap gap-2 pt-2">
                    <div class="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                      Status: {{ score.score >= 80 ? 'Sangat Sehat' : (score.score >= 50 ? 'Sehat' : 'Perlu Perhatian') }}
                    </div>
                    <div class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-syn-muted text-xs">
                      Terakhir diperbarui: {{ score.updated_at ? new Date(score.updated_at).toLocaleDateString() : 'Baru saja' }}
                    </div>
                  </div>
                </div>
             </div>
             
             <div v-else class="relative z-10 py-10 flex flex-col items-center justify-center text-center">
                <div class="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-syn-muted mb-4">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <p class="text-syn-muted max-w-sm mb-4">Data Business Score belum tersedia untuk bisnis ini saat ini.</p>
                <!-- <button @click="generateScore" class="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-sm font-medium hover:bg-emerald-500/30 transition-colors">
                  Generate Score (AI)
                </button> -->
             </div>
          </div>

          <!-- Metrics Section -->
          <div class="glass-card p-8 rounded-3xl glow-border relative overflow-hidden">
             <div class="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
             
             <div class="flex justify-between items-center mb-6 relative z-10">
               <h3 class="font-display text-2xl flex items-center gap-3">
                 <span class="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                 </span>
                 Performa Metrik
               </h3>
               
               <NuxtLink v-if="metrics" :to="`/business/${currentActiveBusiness.id}/analytics`" class="text-sm font-medium text-syn-accent hover:text-white transition-colors flex items-center gap-1">
                 Lihat Detail <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
               </NuxtLink>
             </div>

             <div v-if="metrics" class="relative z-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition-colors group">
                  <h4 class="text-sm text-syn-muted mb-2 group-hover:text-syn-cream transition-colors">Pendapatan</h4>
                  <div class="font-display text-2xl font-bold text-syn-accent truncate" :title="'Rp ' + (metrics.revenue || 0).toLocaleString('id-ID')">
                    Rp {{ (metrics.revenue || 0).toLocaleString('id-ID') }}
                  </div>
                </div>
                
                <div class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition-colors group">
                  <h4 class="text-sm text-syn-muted mb-2 group-hover:text-syn-cream transition-colors">Biaya Operasional</h4>
                  <div class="font-display text-2xl font-bold truncate" :title="'Rp ' + (metrics.operational_cost || 0).toLocaleString('id-ID')">
                    Rp {{ (metrics.operational_cost || 0).toLocaleString('id-ID') }}
                  </div>
                </div>

                <div class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition-colors group">
                  <h4 class="text-sm text-syn-muted mb-2 group-hover:text-syn-cream transition-colors">COGS (HPP)</h4>
                  <div class="font-display text-2xl font-bold truncate" :title="'Rp ' + (metrics.cogs || 0).toLocaleString('id-ID')">
                    Rp {{ (metrics.cogs || 0).toLocaleString('id-ID') }}
                  </div>
                </div>
                
                <div class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition-colors group">
                  <h4 class="text-sm text-syn-muted mb-2 group-hover:text-syn-cream transition-colors">Laba Bersih</h4>
                  <div class="font-display text-2xl font-bold truncate" :class="(metrics.net_profit || 0) < 0 ? 'text-red-400' : 'text-emerald-400'" :title="'Rp ' + (metrics.net_profit || 0).toLocaleString('id-ID')">
                    Rp {{ (metrics.net_profit || 0).toLocaleString('id-ID') }}
                  </div>
                </div>

                <div class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition-colors group sm:col-span-2 lg:col-span-4 flex flex-col justify-center">
                  <h4 class="text-sm text-syn-muted mb-2">Simpulan Periode ({{ metrics.period || 'Saat ini' }})</h4>
                  <p class="text-sm text-syn-cream/80 italic">
                    "Fokuskan pada efisiensi biaya operasional ({{ ((metrics.operational_cost || 0) / ((metrics.revenue || 1)) * 100).toFixed(1) }}% dari pendapatan) untuk meningkatkan margin laba bersih."
                  </p>
                </div>
             </div>
             
             <div v-else class="relative z-10 py-10 flex flex-col items-center justify-center text-center">
                <div class="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-syn-muted mb-4">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                </div>
                <p class="text-syn-muted max-w-sm mb-4">Metrik bisnis belum tersedia. Terus catat transaksi untuk mendapatkan laporan bulanan.</p>
                <!-- <button @click="snapshotMetrics" class="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-sm font-medium hover:bg-blue-500/30 transition-colors">
                  Tutup Buku & Record Metrik
                </button> -->
             </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm shadow-2xl overflow-hidden">
      <div class="glass-card max-w-xl w-full p-6 sm:p-8 rounded-3xl relative max-h-[90vh] overflow-y-auto scrollbar-hide">
        <button @click="closeModal" class="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/5 hover:bg-white/10 p-2 rounded-full backdrop-blur-md z-10 text-syn-muted hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <h2 class="font-display text-2xl mb-6">{{ isEditMode ? 'Edit Bisnis' : 'Tambah Bisnis Baru' }}</h2>
        
        <form @submit.prevent="saveBusiness" class="space-y-4">
          <div>
            <label class="block text-sm text-syn-muted mb-1">Nama Bisnis</label>
            <input v-model="form.name" type="text" required class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-syn-accent outline-none">
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-syn-muted mb-1">Kategori</label>
              <select v-model="form.category" required class="w-full bg-syn-darker border border-white/10 rounded-xl px-4 py-2 focus:border-syn-accent outline-none">
                <option value="F&B">F&B</option>
                <option value="Retail">Retail</option>
                <option value="Jasa">Jasa</option>
                <option value="Teknologi">Teknologi</option>
                <option value="Manufaktur">Manufaktur</option>
                <option value="Lainnya">Lainnya (Ketik sendiri)</option>
              </select>
              <input 
                v-if="form.category === 'Lainnya'" 
                v-model="form.customCategory" 
                type="text" 
                placeholder="Tuliskan kategori bisnis Anda..." 
                required 
                class="w-full mt-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-syn-accent outline-none text-sm"
              >
            </div>
            <div>
              <label class="block text-sm text-syn-muted mb-1">Telepon</label>
              <input v-model="form.phone" type="text" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-syn-accent outline-none">
            </div>
          </div>
          
          <div>
            <label class="block text-sm text-syn-muted mb-1">Alamat Bisnis</label>
            <textarea v-model="form.address" rows="2" placeholder="Masukkan alamat lengkap..." required class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-syn-accent outline-none mb-4"></textarea>
            
            <div class="block text-sm text-syn-muted mb-1">Koordinat Lokasi (Opsional untuk Radius)</div>
            <div class="flex gap-2">
              <input v-model="form.latitude" type="text" placeholder="Latitude" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-syn-accent outline-none text-sm">
              <input v-model="form.longitude" type="text" placeholder="Longitude" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-syn-accent outline-none text-sm">
              <button type="button" @click="getLocation" class="shrink-0 px-4 bg-syn-darker border border-white/10 hover:border-syn-accent rounded-xl text-syn-accent text-sm font-medium flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Track
              </button>
            </div>
            <p v-if="locationError" class="text-xs text-red-400 mt-1">{{ locationError }}</p>
          </div>
          
          <div>
            <label class="block text-sm text-syn-muted mb-1">Deskripsi</label>
            <textarea v-model="form.description" rows="3" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-syn-accent outline-none mb-4"></textarea>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-syn-muted mb-1">No. WhatsApp (opsional)</label>
                <input v-model="form.whatsapp" type="text" placeholder="Contoh: 08123..." class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-syn-accent outline-none text-sm">
              </div>
              <div>
                <label class="block text-xs text-syn-muted mb-1">Username Instagram (opsional)</label>
                <input v-model="form.instagram" type="text" placeholder="Contoh: synconomics" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-syn-accent outline-none text-sm">
              </div>
              <div>
                <label class="block text-xs text-syn-muted mb-1">Username TikTok (opsional)</label>
                <input v-model="form.tiktok" type="text" placeholder="Contoh: synconomics_id" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-syn-accent outline-none text-sm">
              </div>
              <div>
                <label class="block text-xs text-syn-muted mb-1">Website Utama (opsional)</label>
                <input v-model="form.website" type="text" placeholder="Contoh: domainkamu.com" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-syn-accent outline-none text-sm">
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm text-syn-muted mb-1">Logo Bisnis</label>
            <input @change="handleFileChange" type="file" accept=".jpg, .jpeg, image/jpeg" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:border-syn-accent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-syn-accent file:text-syn-dark hover:file:bg-white text-sm text-syn-muted">
            <p class="text-xs text-syn-muted mt-2 italic">* Format gambar harus JPG/JPEG dan ukuran maksimal 5 MB.</p>
          </div>

          <button type="submit" :disabled="isSaving" class="w-full py-3 mt-4 bg-syn-accent text-syn-dark rounded-xl font-display font-medium hover:bg-white transition-colors disabled:opacity-50">
            {{ isSaving ? 'Menyimpan...' : 'Simpan Bisnis' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBusiness } from '~/composables/useBusiness';
import { useBusinessDetail } from '~/composables/useBusinessDetail';
import type { Business } from '~/types/business.types';
import { businessService } from '~/services/business.service';

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
});

const { businesses, isLoading, error, isSaving, fetchBusinesses, createBusiness, updateBusiness } = useBusiness();

// To manage local details loading independently
const isFetchingDetail = ref(true);
const detailError = ref<string | null>(null);
const currentActiveBusiness = ref<Business | null>(null);
const metrics = ref<any | null>(null);
const score = ref<any | null>(null);

const showModal = ref(false);
const isEditMode = ref(false);
const editingId = ref<number | null>(null);
const fileInput = ref<File | null>(null);
const locationError = ref('');

const form = ref({
  name: '',
  category: 'F&B',
  customCategory: '',
  description: '',
  phone: '',
  address: '',
  latitude: '',
  longitude: '',
  whatsapp: '',
  instagram: '',
  tiktok: '',
  website: ''
});

onMounted(async () => {
  await fetchBusinesses();
  if (businesses.value && businesses.value.length > 0 && businesses.value[0]) {
    await fetchDetailData(businesses.value[0].id);
  } else {
    isFetchingDetail.value = false;
  }
});

const fetchDetailData = async (businessId: number) => {
  isFetchingDetail.value = true;
  detailError.value = null;
  try {
    const [businessRes, metricsRes, scoreRes] = await Promise.allSettled([
      businessService.getById(businessId),
      businessService.getLatestMetrics(businessId),
      businessService.getLatestScore(businessId)
    ]);

    if (businessRes.status === 'fulfilled') {
      currentActiveBusiness.value = businessRes.value.data;
    } else {
      throw new Error('Gagal memuat detail bisnis');
    }

    if (metricsRes.status === 'fulfilled') {
      metrics.value = metricsRes.value.data;
    }
    
    if (scoreRes.status === 'fulfilled') {
      score.value = scoreRes.value.data;
    }
  } catch (err: any) {
    detailError.value = err.message || err.data?.message || 'Gagal memuat data statistik bisnis';
  } finally {
    isFetchingDetail.value = false;
  }
};

const openCreateModal = () => {
  isEditMode.value = false;
  editingId.value = null;
  locationError.value = '';
  form.value = { 
    name: '', category: 'F&B', customCategory: '', description: '', phone: '', 
    address: '', latitude: '', longitude: '',
    whatsapp: '', instagram: '', tiktok: '', website: ''
  };
  fileInput.value = null;
  showModal.value = true;
};

const editBusiness = (business: Business) => {
  isEditMode.value = true;
  editingId.value = business.id;
  locationError.value = '';
  
  const predefinedCategories = ['F&B', 'Retail', 'Jasa', 'Teknologi', 'Manufaktur'];
  const isCustom = !predefinedCategories.includes(business.category);

  form.value = {
    name: business.name,
    category: isCustom ? 'Lainnya' : business.category,
    customCategory: isCustom ? business.category : '',
    description: business.description || '',
    phone: business.phone || '',
    address: business.address || '',
    latitude: business.latitude ? String(business.latitude) : '',
    longitude: business.longitude ? String(business.longitude) : '',
    whatsapp: business.whatsapp || '',
    instagram: business.instagram || '',
    tiktok: business.tiktok || '',
    website: business.website || ''
  };
  fileInput.value = null;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    fileInput.value = target.files[0] || null;
  }
};

const saveBusiness = async () => {
  const formData = new FormData();
  formData.append('name', form.value.name);
  
  const finalCategory = form.value.category === 'Lainnya' ? form.value.customCategory : form.value.category;
  formData.append('category', finalCategory);
  
  formData.append('description', form.value.description);
  formData.append('phone', form.value.phone);
  formData.append('address', form.value.address);
  if (form.value.latitude) formData.append('latitude', form.value.latitude);
  if (form.value.longitude) formData.append('longitude', form.value.longitude);
  if (form.value.whatsapp) formData.append('whatsapp', form.value.whatsapp);
  if (form.value.instagram) formData.append('instagram', form.value.instagram);
  if (form.value.tiktok) formData.append('tiktok', form.value.tiktok);
  if (form.value.website) formData.append('website', form.value.website);
  
  if (fileInput.value) {
    formData.append('logo_url', fileInput.value);
  }

  try {
    if (isEditMode.value && editingId.value) {
      const updated = await updateBusiness(editingId.value, formData);
      // Update local view
      if (updated && currentActiveBusiness.value && currentActiveBusiness.value.id === updated.id) {
         currentActiveBusiness.value = updated;
      }
    } else {
      await createBusiness(formData);
      // Auto fetch new detail immediately if it was their first business
       if (businesses.value && businesses.value.length === 1 && businesses.value[0]) {
          await fetchDetailData(businesses.value[0].id);
       }
    }
    closeModal();
  } catch (err) {
    console.error(err);
  }
};

const generateScore = () => {
  alert('API call to trigger score generation will be implemented here');
  // Trigger POST /business-scores
};

const snapshotMetrics = () => {
  alert('API call to trigger monthly snapshot will be implemented here');
  // Trigger POST /business-metrics
};

const getLocation = () => {
  locationError.value = '';
  if (!navigator.geolocation) {
    locationError.value = 'Geolocation is not supported by your browser.';
    return;
  }
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      form.value.latitude = position.coords.latitude.toString();
      form.value.longitude = position.coords.longitude.toString();
    },
    (err) => {
      console.error(err);
      locationError.value = 'Gagal mendapatkan lokasi. Pastikan izin lokasi diberikan.';
    }
  );
};
</script>
