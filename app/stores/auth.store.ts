import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '../types/auth.types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);

  function setUser(newUser: User | null) {
    user.value = newUser;
    isAuthenticated.value = !!newUser;
  }

  function clearAuth() {
    user.value = null;
    isAuthenticated.value = false;
  }

  return {
    user,
    isAuthenticated,
    setUser,
    clearAuth
  };
});
