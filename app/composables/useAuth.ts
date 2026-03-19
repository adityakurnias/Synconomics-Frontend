import type { AuthResponse, LoginPayload, RegisterPayload } from '~/types/main.type'

export const useAuth = () => {
  const config = useRuntimeConfig()
  
  const tokenCookie = useCookie<string | null>('auth_token', { maxAge: 60 * 60 * 24 * 7 }) 
  const userState = useState<AuthResponse['user'] | null>('auth_user', () => null)

  const Login = async (payload: LoginPayload) => {
    try {
      const response = await $fetch<AuthResponse>('/api/login', {
        baseURL: config.public.apiBase as string,
        method: 'POST',
        body: payload
      })

      tokenCookie.value = response.token
      userState.value = response.user
      
      navigateTo('/tes')
      return response
    } catch (error) {
      console.error('Login Error:', error)
      throw error
    }
  }
  
  const Register = async (payload: RegisterPayload) => {
    try {
      const response = await $fetch<AuthResponse>('/api/register', {
        baseURL: config.public.apiBase as string,
        method: 'POST',
        body: payload
      })
      
      tokenCookie.value = response.token
      userState.value = response.user
      
      navigateTo('/tes')
      return response
    } catch (error) {
      console.error('Register Error:', error)
      throw error
    }
  }

  const GoogleLogin = () => {
    const url = `${config.public.apiBase}/api/auth/google`
    window.location.href = url
    navigateTo('/tes')
  }

  return {
    token: tokenCookie,
    user: userState,
    Login,
    Register,
    GoogleLogin
  }
}
