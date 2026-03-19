<template>
  <div
    class="flex hero-gradient items-center justify-center min-h-screen w-full px-4 py-12"
  >
    <div class="max-w-md w-full relative">
      <div
        class="absolute -top-20 -right-20 w-48 h-48 bg-syn-accent/20 rounded-full blur-3xl pointer-events-none"
      ></div>
      <div
        class="absolute -bottom-20 -left-20 w-48 h-48 bg-syn-gold/10 rounded-full blur-3xl pointer-events-none"
      ></div>

      <div
        class="glass-card rounded-3xl border border-white/10 bg-white/5 relative z-10 overflow-hidden"
      >
        <div class="p-8 md:p-10">
          <h2
            class="font-display text-4xl font-medium mb-8 text-center text-white tracking-tight"
          >
            Register
          </h2>

          <form @submit.prevent="handleRegister" class="flex flex-col">
            <div class="mb-5">
              <label
                for="name"
                class="block text-syn-cream/80 text-sm mb-2 font-medium"
                >Name</label
              >
              <input
                v-model="name"
                type="text"
                id="name"
                class="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-syn-accent/50 focus:bg-white/10 transition-colors duration-300 text-white placeholder-white/20"
                placeholder="Enter your name"
                required
              />
            </div>

            <div class="mb-5">
              <label
                for="email"
                class="block text-syn-cream/80 text-sm mb-2 font-medium"
                >Email</label
              >
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
              <label
                for="password"
                class="block text-syn-cream/80 text-sm mb-2 font-medium"
                >Password</label
              >
              <input
                v-model="password"
                type="password"
                id="password"
                class="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-syn-accent/50 focus:bg-white/10 transition-colors duration-300 text-white placeholder-white/20"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              class="w-full magnetic-btn group cursor-pointer relative px-8 py-4 bg-syn-accent text-syn-dark rounded-full font-display font-medium text-lg overflow-hidden"
            >
              <span class="relative z-10">Register</span>
              <div
                class="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"
              ></div>
            </button>
          </form>

          <div
            v-if="errorMessage"
            class="mb-6 text-red-400 text-sm text-center"
          >
            {{ errorMessage }}
          </div>

          <p class="text-sm text-center mt-8 text-syn-muted">
            Already have an account?
            <span
              class="text-syn-accent font-medium hover:text-white transition-colors cursor-pointer"
              ><a href="/auth/login">Login</a></span
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

definePageMeta({
  middleware: ["guest"],
});

const { Register } = useAuth();
const email = ref("");
const password = ref("");
const name = ref("");
const loading = ref(false);
const error = ref("");
const errorMessage = ref("");

const handleRegister = async () => {
  loading.value = true;
  error.value = "";
  try {
    errorMessage.value = "";
    await Register({
      email: email.value,
      password: password.value,
      name: name.value,
    });
  } catch (err) {
    errorMessage.value = "Kredensial anda tidak valid";
  } finally {
    loading.value = false;
  }
};
</script>

<style></style>
