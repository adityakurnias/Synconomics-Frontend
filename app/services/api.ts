import { useCookie } from '#app'; // Import useCookie directly

export const apiFetch = $fetch.create({
  onRequest({ request, options }) {
    options.baseURL = "https://api-synconomics.synchronizeteams.com/api";

    const tokenCookie = useCookie<string | null>('auth_token');
    
    if (tokenCookie.value) {
      const headers = new Headers(options.headers);
      headers.set("Authorization", `Bearer ${tokenCookie.value}`);
      options.headers = headers;
    }

    if (import.meta.dev) {
      console.log(`[API] ${options.method || 'GET'} ${request}`);
    }
  },
  
  onResponseError({ response }) {
    if (response.status === 401) {
      const token = useCookie("auth_token");
      token.value = null;
      
      if (import.meta.client) {
        alert("Sesi Anda telah berakhir. Silakan login kembali.");
        navigateTo("/auth/login"); // Gunakan navigateTo dari Nuxt
      }
    }
  },
});