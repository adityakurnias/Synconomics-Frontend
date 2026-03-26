import { authService } from '../services/auth.service'
import type { User, LoginResponse } from '../types/auth.types'

export const useAuth = () => {
  const config = useRuntimeConfig()
  
  const tokenCookie = useCookie<string | null>('auth_token', { maxAge: 60 * 60 * 24 * 7 }) 
  const userCookie = useCookie<User | null>('user_data', { maxAge: 60 * 60 * 24 * 7 })
  const userState = useState<User | null>('auth_user', () => userCookie.value || null)

  // Auto-fetch if token exists but state is empty (e.g. on refresh)
  if (tokenCookie.value && !userState.value && import.meta.client) {
    onMounted(() => {
      FetchProfile()
    })
  }

  const FetchProfile = async () => {
    if (!tokenCookie.value) return null
    try {
      const response = await authService.getProfile()
      const userData = response.data as any
      const userObj = userData?.user || userData
      
      console.log('[useAuth] FetchProfile response data:', JSON.stringify(userData))
      
      if (userObj && userObj.id) {
        // Preserve existing avatar if new data doesn't provide one
        if (!userObj.avatar && userState.value?.avatar) {
          userObj.avatar = userState.value.avatar;
        }
        userState.value = userObj
        userCookie.value = userObj
        return userObj
      }
      return null
    } catch (error) {
      console.error('Fetch Profile Error:', error)
      return null
    }
  }

  const UpdateProfile = async (payload: { name?: string; email?: string }) => {
    try {
      const response = await authService.updateProfile(payload)
      const userData = response.data as any
      const userObj = userData?.user || userData
      
      if (userObj && userObj.id) {
        userState.value = userObj
        userCookie.value = userObj
        return userObj
      }
      return null
    } catch (error) {
      console.error('Update Profile Error:', error)
      throw error
    }
  }

  const Login = async (payload: any) => {
    try {
      const url = `${config.public.apiBase}/api/auth/login`
      const raw: any = await $fetch(url, {
        method: 'POST',
        body: payload
      })

      console.log('[useAuth] Login full raw response:', JSON.stringify(raw))

      const token = raw?.token || raw?.access_token || raw?.data?.token || raw?.data?.access_token
      console.log('[useAuth] Token extracted:', token)

      if (token) {
        tokenCookie.value = token
        
        // Populate user state from response if available
        const userData = raw?.user || raw?.data?.user || raw?.data || null
        if (userData && userData.id) {
          // Merge avatar if present at the top level of raw response
          if (raw?.avatar && typeof userData === 'object') {
            userData.avatar = raw.avatar;
          }
          userState.value = userData
          userCookie.value = userData
        } else {
          await FetchProfile()
        }
      } else {
        console.error('[useAuth] CRITICAL: Token tidak ditemukan di response!', raw)
      }

      await navigateTo('/dashboard')
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
      const userObj = data?.user || data
      
      if (data.token || data.access_token) {
        tokenCookie.value = data.token || data.access_token
      }
      
      if (userObj && userObj.id) {
        // Merge avatar if present at the top level of data response
        if (data?.avatar && typeof userObj === 'object') {
          userObj.avatar = data.avatar;
        }
        userState.value = userObj
        userCookie.value = userObj
      }
      
      await navigateTo('/dashboard')
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
