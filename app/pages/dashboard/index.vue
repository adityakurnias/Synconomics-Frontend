<template>
  <div class="min-h-screen bg-syn-darker flex text-syn-cream font-sans">
    <DashboardSidebar />
    
    <main class="flex-1 flex flex-col min-w-0">
      <DashboardTopNav />

      <div class="flex-1 overflow-y-auto p-8 relative border-t border-syn-border">
        <!-- Background Grain/Gradient -->
        <div class="absolute inset-0 pointer-events-none">
          <div class="grain-overlay"></div>
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-125 hero-gradient opacity-30"></div>
        </div>

        <div class="max-w-[1400px] mx-auto space-y-8 relative z-10">
          
          <!-- Header -->
          <div>
            <h1 class="text-3xl font-serif text-syn-cream mb-2 tracking-tight">Business Health Overview</h1>
            <p class="text-syn-muted text-[15px]">Global performance metrics for the current fiscal quarter.</p>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <DashboardStatCard 
              title="Total Revenue" 
              value="$128,430.00" 
              :trend="12.5" 
              icon="heroicons:arrow-trending-up"
              iconColor="success"
            />
            <DashboardStatCard 
              title="Total Cost" 
              value="$45,200.00" 
              :trend="-2.3" 
              icon="heroicons:banknotes"
              iconColor="danger"
            />
            <DashboardStatCard 
              title="Operational Cost" 
              value="$12,800.00" 
              :trend="-0.5" 
              icon="heroicons:cog"
              iconColor="warning"
            />
            <DashboardStatCard 
              title="Net Profit" 
              value="$70,430.00" 
              :trend="14.2" 
              icon="heroicons:building-library"
              iconColor="accent"
            />
          </div>

          <!-- Main Content Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-8">
              <DashboardProductManagement />
            </div>
            
            <div class="space-y-8 flex flex-col">
              <div class="flex-1">
                <DashboardAiMentor />
              </div>
              <DashboardWeeklyPerformance />
            </div>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})
</script>