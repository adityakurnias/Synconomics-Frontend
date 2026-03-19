<template>
  <div class="flex hero-gradient items-center justify-center min-h-screen w-full px-4 py-12">
    <div class="max-w-md w-full relative">
      
      <div class="absolute -top-20 -right-20 w-48 h-48 bg-syn-accent/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-20 -left-20 w-48 h-48 bg-syn-gold/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="glass-card rounded-3xl border border-white/10 bg-white/5 relative z-10 overflow-hidden">
        <div class="p-8 md:p-10">
          <h2 class="font-display text-4xl font-medium mb-8 text-center text-white tracking-tight">Login</h2>

          <button
            @click="handleGoogleLogin"
            class="w-full flex items-center justify-center gap-2 magnetic-btn px-6 py-4 border border-white/20 rounded-full text-sm font-display text-white hover:border-syn-accent hover:bg-syn-accent hover:text-syn-dark transition-all duration-500 group"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              class="w-5 h-5 transition-transform group-hover:scale-110"
            />
            Login with Google
          </button>

          <div class="flex items-center my-8">
            <div class="grow h-px bg-white/10"></div>
            <span class="px-4 text-syn-muted text-xs uppercase tracking-widest">OR</span>
            <div class="grow h-px bg-white/10"></div>
          </div>

          <form @submit.prevent="handleLogin" class="flex flex-col">
            <div class="mb-5">
              <label for="email" class="block text-syn-cream/80 text-sm mb-2 font-medium">Email</label>
              <input
                v-model="email"
                type="email"
                id="email"
                class="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-syn-accent/50 focus:bg-white/10 transition-colors duration-300 text-white placeholder-white/20"
                placeholder="Enter your email"
                required
              />
            </div>

            <div class="mb-8">
              <label for="password" class="block text-syn-cream/80 text-sm mb-2 font-medium">Password</label>
              <input
                v-model="password"
                type="password"
                id="password"
                class="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-syn-accent/50 focus:bg-white/10 transition-colors duration-300 text-white placeholder-white/20"
                placeholder="Enter your password"
                required
              />
            </div>

            <button class="w-full magnetic-btn group cursor-pointer relative px-8 py-4 bg-syn-accent text-syn-dark rounded-full font-display font-medium text-lg overflow-hidden">
                <span class="relative z-10">Login</span>
                <div class="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </button>
          </form>

          <p class="text-sm text-center mt-8 text-syn-muted">
            Don't have an account? <span class="text-syn-accent font-medium hover:text-white transition-colors cursor-pointer">Register</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"

definePageMeta({
  middleware: ['guest']
})

const { Login, Register, GoogleLogin} = useAuth()
const email = ref("")
const password = ref("")

onMounted(() => {
  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  magneticBtns.forEach((btn: any) => {
      btn.addEventListener('mousemove', (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });
      
      btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'translate(0, 0)';
      });
  });
})

const handleLogin = async () => {
  try {
    await Login({
      email: email.value,
      password: password.value
    })
  } catch (err) {
    console.error("Login error:", err)
  }
}

const handleGoogleLogin = async () => {
  try {
    await GoogleLogin()
  } catch (err) {
    console.error("Google login error:", err)
  }
}
</script>