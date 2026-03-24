import { authService } from '../services/auth.service'
import type { User, LoginResponse } from '../types/auth.types'

export const useAuth = () => {
  const config = useRuntimeConfig()
  
  const tokenCookie = useCookie<string | null>('auth_token', { maxAge: 60 * 60 * 24 * 7 }) 
  const userCookie = useCookie<User | null>('user_data', { maxAge: 60 * 60 * 24 * 7 })
  const userState = useState<User | null>('auth_user', () => userCookie.value || null)

  const FetchProfile = async () => {
    if (!tokenCookie.value) return null
    try {
      const response = await authService.getProfile()
      userState.value = response.data
      userCookie.value = response.data
      return response.data
    } catch (error) {
      console.error('Fetch Profile Error:', error)
      return null
    }
  }

  const UpdateProfile = async (payload: { name?: string; email?: string }) => {
    try {
      const response = await authService.updateProfile(payload)
      userState.value = response.data
      userCookie.value = response.data
      return response.data
    } catch (error) {
      console.error('Update Profile Error:', error)
      throw error
    }
  }

  const Login = async (payload: any) => {
    try {
      const raw: any = await $fetch('https://api-synconomics.synchronizeteams.com/api/auth/login', {
        method: 'POST',
        body: payload
      })

      console.log('[useAuth] Login full raw response:', JSON.stringify(raw))

      const token = raw?.token || raw?.access_token || raw?.data?.token || raw?.data?.access_token
      console.log('[useAuth] Token extracted:', token)

      if (token) {
        tokenCookie.value = token
        await FetchProfile()
      } else {
        console.error('[useAuth] CRITICAL: Token tidak ditemukan di response!', raw)
      }

      navigateTo('/dashboard')
      return raw
    } catch (error) {
      console.error('Login Error:', error)
      throw error
    }
  }
  
  const Register = async (payload: any) => {
    try {
      const response = await authService.register(payload)
      const data = response.data as any
      
      if (data.token || data.access_token) {
        tokenCookie.value = data.token || data.access_token
      }
      
      userState.value = data.user || data
      userCookie.value = userState.value
      
      navigateTo('/dashboard')
      return data
    } catch (error) {
      console.error('Register Error:', error)
      throw error
    }
  }

  const GoogleLogin = () => {
    const url = `${config.public.apiBase}/api/auth/google`
    window.location.href = url
  }

  const Logout = () => {
    tokenCookie.value = null
    userCookie.value = null
    userState.value = null
    navigateTo('/auth/login')
  }

  return {
    token: tokenCookie,
    user: userState,
    Login,
    Register,
    GoogleLogin,
    Logout,
    FetchProfile,
    UpdateProfile
  }
}
