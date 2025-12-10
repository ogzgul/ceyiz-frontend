export const apiUse = () => {
  const config = useRuntimeConfig()
  const jwt = useCookie<string | null>('jwt', { sameSite: 'lax' })

  const request = async <T>(path: string, opts: any = {}) => {
    const headers: Record<string, string> = {
      accept: 'application/json',
      ...(opts.headers || {}),
    }

    if (opts.body && !(opts.body instanceof FormData)) {
      headers['Content-Type'] = headers['Content-Type'] ?? 'application/json'
    }

    const isAuthEndpoint =
      path.startsWith('/api/auth/local') || path.startsWith('/api/auth/local/register')

    if (!isAuthEndpoint && jwt.value) {
      headers.Authorization = `Bearer ${jwt.value}`
    }

    return await $fetch<T>(`${config.public.apiBase}${path}`, { ...opts, headers })
  }

  return { request, jwt }
}
