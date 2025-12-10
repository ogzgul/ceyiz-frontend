type StrapiUser = {
  id: number
  documentId?: string
  username: string
  email: string
  provider?: string
  confirmed?: boolean
  blocked?: boolean
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
}

type StrapiAuthResponse = {
  jwt: string
  user: StrapiUser
}

export const useAuth = () => {
  const { request, jwt } = apiUse()
  const user = useState<StrapiUser | null>('user', () => null)

  const register = async (payload: { username: string; email: string; password: string }) => {
    const res = await request<StrapiAuthResponse>('/api/auth/local/register', {
      method: 'POST',
      body: payload,
    })
    jwt.value = res.jwt
    user.value = res.user
    return res
  }

  const login = async (payload: { identifier: string; password: string }) => {
    const res = await request<StrapiAuthResponse>('/api/auth/local', {
      method: 'POST',
      body: payload,
    })
    jwt.value = res.jwt
    user.value = res.user
    return res
  }

  const me = async () => {
    if (!jwt.value) return null
    const meUser = await request<StrapiUser>('/api/users/me', { method: 'GET' })
    user.value = meUser
    return meUser
  }

  const logout = () => {
    jwt.value = null
    user.value = null
  }

  return { user, jwt, register, login, me, logout }
}
