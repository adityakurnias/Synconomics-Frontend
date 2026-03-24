import { useAuth } from "~/composables/useAuth"; // atau path yang sesuai

export const apiFetch = $fetch.create({
  onRequest({ request, options }) {
    // 1. Fix: Hapus spasi di akhir URL
    options.baseURL = "https://api-synconomics.synchronizeteams.com/api";

    // 2. Fix: Gunakan headers yang sudah ada atau buat baru
    options.headers = options.headers || {};
    
    // 3. Fix: Normalisasi headers ke Record<string, string>
    const headers = new Headers(options.headers);
    
    // 4. Fix: Ambil token dari cookie secara manual (lebih reliable di $fetch)
    const { token } = useAuth();
    if (token.value) {
      headers.set("Authorization", `Bearer ${token.value}`);
    }

    options.headers = headers;
    // Debug: Cek apakah token terkirim
    console.log("Request headers:", headers);
  },
  
  onResponseError({ response }) {
    if (response.status === 401) {
      const token = useCookie("token");
      token.value = null;
      
      if (import.meta.client) {
        alert("Sesi Anda telah berakhir. Silakan login kembali.");
        navigateTo("/auth/login"); // Gunakan navigateTo dari Nuxt
      }
    }
  },
});