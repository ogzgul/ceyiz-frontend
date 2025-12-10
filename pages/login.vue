<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Tekrar Hoşgeldin 👋</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">E-Posta</label>
          <input v-model="email" type="email" required
            class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 outline-none">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
          <input v-model="password" type="password" required
            class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 outline-none">
        </div>

        <button type="submit"
          class="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition">
          Giriş Yap
        </button>
      </form>

      <div class="mt-4 text-center text-sm">
        Hesabın yok mu?
        <NuxtLink to="/register" class="text-blue-600 font-bold hover:underline">Üye Ol</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')

const getStrapiErrorMessage = (err: any) => {
  const data = err?.data
  return (
    data?.error?.message ||
    data?.message ||
    err?.message ||
    'Giriş sırasında hata oluştu.'
  )
}

const handleLogin = async () => {
  try {
    await login({
      identifier: email.value.trim(),
      password: password.value
    })

    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      icon: 'success',
      title: 'Giriş Başarılı'
    })

    router.push('/')
  } catch (err: any) {
    console.log('STATUS:', err?.status)
    console.log('DATA:', err?.data)
    console.log('HEADERS:', err?.response?.headers)
    console.error('RAW:', err)

    Swal.fire({
      title: 'Giriş Yapılamadı',
      text: getStrapiErrorMessage(err),
      icon: 'error',
      confirmButtonText: 'Tamam',
      confirmButtonColor: '#374151'
    })
  }
}
</script>
