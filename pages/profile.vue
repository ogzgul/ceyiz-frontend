<template>
  <div class="bg-[#fff5f5] min-h-screen pb-20 font-sans">
    
    <header class="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-rose-100 shadow-sm">
      <div class="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <button @click="router.back()" class="w-10 h-10 flex items-center justify-center rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition shadow-sm border border-rose-100">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h1 class="text-xl font-bold text-gray-800 tracking-tight">Profilim</h1>
        <div class="w-10"></div> </div>
    </header>

    <div class="max-w-2xl mx-auto px-4 py-8">

      <div class="flex flex-col items-center mb-8">
        <div class="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-400 to-pink-500 p-1 shadow-lg shadow-rose-200">
          <div class="w-full h-full bg-white rounded-full flex items-center justify-center text-3xl font-bold text-rose-500">
            {{ getInitials(user?.username) }}
          </div>
        </div>
        <h2 class="mt-4 text-2xl font-bold text-gray-800">{{ user?.username }}</h2>
        <p class="text-gray-500 text-sm">{{ user?.email }}</p>
      </div>

      <div class="bg-white rounded-3xl shadow-sm border border-rose-100 p-6 mb-6">
        <h3 class="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
          <i class="fas fa-user-edit text-rose-500"></i> Kişisel Bilgiler
        </h3>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Kullanıcı Adı</label>
            <input 
              v-model="form.username" 
              type="text" 
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition"
            >
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">E-Posta</label>
            <input 
              v-model="form.email" 
              type="email" 
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition"
            >
          </div>

          <button 
            @click="updateProfile" 
            :disabled="loading"
            class="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition shadow-lg shadow-gray-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span v-if="loading">Güncelleniyor...</span>
            <span v-else>Bilgileri Güncelle</span>
          </button>
        </div>
      </div>

      <div class="bg-white rounded-3xl shadow-sm border border-rose-100 p-6 mb-8">
        <h3 class="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
          <i class="fas fa-lock text-rose-500"></i> Şifre Değiştir
        </h3>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Yeni Şifre</label>
            <input 
              v-model="passForm.password" 
              type="password" 
              placeholder="******"
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition"
            >
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Yeni Şifre (Tekrar)</label>
            <input 
              v-model="passForm.confirmPassword" 
              type="password" 
              placeholder="******"
              class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition"
            >
          </div>

          <button 
            @click="updatePassword" 
            :disabled="loadingPass"
            class="w-full bg-rose-50 text-rose-600 font-bold py-3 rounded-xl hover:bg-rose-100 transition border border-rose-100 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span v-if="loadingPass">İşleniyor...</span>
            <span v-else>Şifreyi Değiştir</span>
          </button>
        </div>
      </div>

      <button 
        @click="handleLogout" 
        class="w-full text-red-500 font-bold py-4 rounded-xl hover:bg-red-50 transition border border-transparent hover:border-red-100 flex items-center justify-center gap-2"
      >
        <i class="fas fa-sign-out-alt"></i> Oturumu Kapat
      </button>

    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'

const router = useRouter()
const { user, logout } = useAuth()
const { request } = apiUse()

const loading = ref(false)
const loadingPass = ref(false)

// Profil Form Verileri
const form = reactive({
  username: user.value?.username || '',
  email: user.value?.email || ''
})

// Şifre Form Verileri
const passForm = reactive({
  password: '',
  confirmPassword: ''
})

// Avatar için baş harf
const getInitials = (name) => name ? name.substring(0, 1).toUpperCase() : '?'

// 1. Profil Güncelleme Fonksiyonu
const updateProfile = async () => {
  if (!user.value) return

  loading.value = true
  try {
    await request(`/api/users/${user.value.id}`, {
      method: 'PUT',
      body: {
        username: form.username,
        email: form.email
      }
    })

    // Kullanıcı bilgisini state'te de güncellemek gerekebilir veya sayfayı yenilemek
    // Strapi'den dönen güncel veriyi auth state'ine basmak en doğrusudur.
    // Şimdilik başarı mesajı gösteriyoruz.
    
    Swal.fire({
      icon: 'success',
      title: 'Güncellendi',
      text: 'Profil bilgilerin başarıyla kaydedildi.',
      confirmButtonColor: '#e11d48',
      timer: 2000,
      showConfirmButton: false
    })

  } catch (e) {
    console.error(e)
    Swal.fire('Hata', 'Bilgiler güncellenemedi. E-posta kullanımda olabilir.', 'error')
  } finally {
    loading.value = false
  }
}

// 2. Şifre Güncelleme Fonksiyonu
const updatePassword = async () => {
  if (!user.value) return

  if (passForm.password.length < 6) {
    return Swal.fire('Uyarı', 'Şifre en az 6 karakter olmalıdır.', 'warning')
  }

  if (passForm.password !== passForm.confirmPassword) {
    return Swal.fire('Uyarı', 'Şifreler birbiriyle uyuşmuyor.', 'warning')
  }

  loadingPass.value = true
  try {
    await request(`/api/users/${user.value.id}`, {
      method: 'PUT',
      body: {
        password: passForm.password
      }
    })

    passForm.password = ''
    passForm.confirmPassword = ''

    Swal.fire({
      icon: 'success',
      title: 'Şifre Değişti',
      text: 'Yeni şifrenizle giriş yapabilirsiniz.',
      confirmButtonColor: '#e11d48'
    })

  } catch (e) {
    console.error(e)
    Swal.fire('Hata', 'Şifre değiştirilemedi.', 'error')
  } finally {
    loadingPass.value = false
  }
}

// Çıkış Yapma
const handleLogout = () => {
  Swal.fire({
    title: 'Çıkış Yapılıyor',
    text: 'Emin misiniz?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Evet, Çıkış Yap',
    cancelButtonText: 'İptal'
  }).then((result) => {
    if (result.isConfirmed) {
      logout()
      router.push('/login')
    }
  })
}
</script>