<template>
  <div class="min-h-screen flex items-center justify-center bg-rose-50 px-4">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-rose-100">
      <h1 class="text-2xl font-bold text-center text-rose-600 mb-2">Çeyiz Asistanı</h1>
      <p class="text-center text-gray-500 mb-6">Hemen üye ol, listeni oluşturmaya başla.</p>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
          <input
            v-model="form.username"
            type="text"
            required
            class="w-full px-4 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500 outline-none transition"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">E-Posta</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500 outline-none transition"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full px-4 py-2 border rounded-lg focus:ring-rose-500 focus:border-rose-500 outline-none transition"
          >
        </div>

        <p v-if="errorMsg" class="text-red-500 text-sm text-center">{{ errorMsg }}</p>

        <button
          type="submit"
          class="w-full bg-rose-600 text-white py-3 rounded-lg font-bold hover:bg-rose-700 transition"
        >
          Üye Ol
        </button>
      </form>

      <div class="mt-4 text-center text-sm">
        Zaten hesabın var mı?
        <NuxtLink to="/login" class="text-rose-600 font-bold hover:underline">Giriş Yap</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'

const router = useRouter()
const { register } = useAuth()

const form = ref({
  username: '',
  email: '',
  password: '',
})

const errorMsg = ref('')

const getStrapiErrorMessage = (err: any) => {
  const data = err?.data
  return (
    data?.error?.message ||
    data?.message ||
    err?.message ||
    'Kayıt olurken bir sorun çıktı.'
  )
}

const handleRegister = async () => {
  try {
    errorMsg.value = ''

    await register({
      username: form.value.username.trim(),
      email: form.value.email.trim().toLowerCase(),
      password: form.value.password,
    })

    await Swal.fire({
      title: 'Aramıza Hoşgeldin!',
      text: 'Hesabın başarıyla oluşturuldu.',
      icon: 'success',
      confirmButtonText: 'Harika',
      confirmButtonColor: '#e11d48',
    })

    router.push('/')
  } catch (err: any) {
    console.error(err)
    errorMsg.value = getStrapiErrorMessage(err)

    Swal.fire({
      title: 'Hata!',
      text: errorMsg.value || 'Kayıt olurken bir sorun çıktı. Kullanıcı adı veya email alınmış olabilir.',
      icon: 'error',
      confirmButtonText: 'Tekrar Dene',
    })
  }
}
</script>
