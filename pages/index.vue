<template>
  <div class="bg-gray-50 min-h-screen pb-20 font-sans">
    
    <nav class="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-rose-100">
      <div class="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 class="text-xl font-bold text-rose-600 flex items-center gap-2 tracking-tight">
          <span class="bg-rose-100 p-1.5 rounded-lg"><i class="fas fa-ring"></i></span>
          Çeyiz Asistanı
        </h1>
        <div class="flex items-center space-x-3">
           <NuxtLink to="/listem" class="bg-gray-900 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-gray-800 transition shadow-lg shadow-gray-200">
             <i class="fas fa-clipboard-check mr-1"></i> Listem
           </NuxtLink>
           <button @click="handleLogout" class="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition">
             <i class="fas fa-sign-out-alt text-xs"></i>
           </button>
        </div>
      </div>
    </nav>

    <div class="max-w-3xl mx-auto px-4 py-6">
      
      <div class="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-8 rounded-3xl mb-10 shadow-xl shadow-rose-200 relative overflow-hidden">
        <div class="relative z-10">
          <h2 class="text-3xl font-extrabold mb-2">Keşfetmeye Başla</h2>
          <p class="opacity-90 font-medium">Başkalarının deneyimleri, senin en doğru kararın olsun.</p>
        </div>
        <div class="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
        <div class="absolute bottom-0 left-0 w-24 h-24 bg-purple-500 opacity-20 rounded-full blur-xl"></div>
      </div>

      <div class="flex items-center justify-between mb-6 px-1">
        <h3 class="font-bold text-gray-800 text-lg flex items-center gap-2">
          <i class="fas fa-magic text-indigo-500"></i> Vitrin
        </h3>
        <span class="text-xs text-gray-400 font-medium">En Yeniler</span>
      </div>

      <div v-if="loading" class="grid gap-6">
        <div v-for="i in 3" :key="i" class="bg-white p-4 rounded-2xl shadow-sm h-48 animate-pulse flex flex-col justify-between">
           <div class="flex gap-3"><div class="w-10 h-10 bg-gray-200 rounded-full"></div><div class="w-32 h-4 bg-gray-200 rounded"></div></div>
           <div class="w-full h-20 bg-gray-100 rounded-xl"></div>
        </div>
      </div>

      <div v-else class="space-y-8">
        <div v-for="rec in recommendations" :key="rec.id" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
          
          <div class="p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-50 to-rose-50 border border-white shadow-sm flex items-center justify-center text-gray-700 font-bold text-sm">
                {{ getInitials(rec.recommender?.username || rec.user?.username) }}
              </div>
              <div>
                <p class="text-sm font-bold text-gray-800">{{ rec.recommender?.username || rec.user?.username || 'Anonim' }}</p>
                <p class="text-[10px] text-gray-400">bir ürün tavsiye etti</p>
              </div>
            </div>
            <div class="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
               {{ formatDate(rec.createdAt) }}
            </div>
          </div>

          <NuxtLink :to="`/recommendations/${rec.id}`" class="block px-4 pb-2 cursor-pointer" v-if="rec.product">
            <div class="flex gap-4">
               <div class="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden relative">
                  <img v-if="rec.product.imageUrl" :src="rec.product.imageUrl" class="w-full h-full object-cover" onerror="this.style.display='none'">
                  <img v-else-if="rec.product.image?.url" :src="config.public.apiBase.replace('/api','') + rec.product.image.url" class="w-full h-full object-cover">
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-300"><i class="fas fa-image text-2xl"></i></div>
               </div>
               <div class="flex-1">
                  <h4 class="font-bold text-lg text-gray-800 tracking-tight leading-snug group-hover:text-rose-600 transition-colors">{{ rec.product.title }}</h4>
                  <span v-if="rec.product.price" class="bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded-lg text-xs border border-rose-100 inline-block mb-2 mt-1">₺{{ rec.product.price }}</span>
                  <div class="relative bg-gray-50 p-3 rounded-xl text-gray-600 text-xs leading-relaxed border border-gray-100 mt-1">
                    <i class="fas fa-quote-left absolute -top-1.5 left-2 text-rose-300 bg-white px-1 text-xs"></i>
                    {{ rec.description || rec.comment }}
                  </div>
               </div>
            </div>
          </NuxtLink>

          <div class="px-4 py-3 mt-2 flex items-center justify-between border-t border-gray-50 bg-gray-50/30">
             <button @click.stop="handleLike(rec)" class="flex items-center gap-1.5 transition text-sm font-medium" :class="isLiked(rec) ? 'text-rose-500' : 'text-gray-400 hover:text-rose-400'">
               <i class="fas fa-heart text-lg" :class="{'fas': isLiked(rec), 'far': !isLiked(rec)}"></i> 
               <span>{{ rec.liked_by?.length || 0 }}</span>
             </button>
             
             <div v-if="rec.product">
                 <span v-if="isInMyList(rec.product.title)" class="text-green-600 bg-green-50 px-3 py-1.5 rounded-xl text-xs font-bold border border-green-100 flex items-center gap-1 cursor-default">
                     <i class="fas fa-check"></i> Listende Var
                 </span>

                 <button 
                    v-else 
                    @click.stop="addToList(rec.product)" 
                    class="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-black transition shadow-lg shadow-gray-200 flex items-center gap-2 transform active:scale-95"
                 >
                   <span>Listeme Ekle</span> <i class="fas fa-plus"></i>
                 </button>
             </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 border-t border-gray-100">
            <div v-if="rec.comments && rec.comments.length > 0" class="mb-3">
                <div class="flex gap-2 items-start text-xs">
                    <span class="font-bold text-gray-900 whitespace-nowrap">
                        {{ rec.comments[0].users_permissions_user?.username || 'Anonim' }}:
                    </span>
                    <span class="text-gray-600 line-clamp-1">{{ rec.comments[0].content }}</span>
                </div>
                <button v-if="rec.comments.length > 1" @click="openCommentModal(rec)" class="text-gray-400 text-[10px] font-medium mt-1 hover:text-rose-500 transition flex items-center gap-1">
                    {{ rec.comments.length }} yorumun tümünü gör
                </button>
            </div>
            <div class="flex gap-2 items-center">
                <div class="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-[10px] font-bold text-rose-600 ml-1">
                    {{ user ? getInitials(user.username) : '?' }}
                </div>
                <input v-model="rec.draftComment" type="text" placeholder="Yorum ekle..." class="flex-1 bg-transparent border-b border-gray-200 py-1 text-xs focus:outline-none focus:border-rose-400 transition placeholder-gray-400" @keyup.enter="submitComment(rec)">
                <button v-if="rec.draftComment" @click="submitComment(rec)" class="text-rose-600 font-bold text-xs hover:text-rose-700 transition">Paylaş</button>
            </div>
          </div>
        </div>
        
        <div v-if="recommendations.length === 0" class="text-center py-20 opacity-50">
          <p>Henüz tavsiye yok. İlk tavsiyeyi sen ver!</p>
        </div>
      </div>
    </div>

    <div v-if="activeModalItem" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="closeCommentModal"></div>
        <div class="bg-white rounded-3xl w-full max-w-lg h-[80vh] flex flex-col shadow-2xl relative z-10 animate-fade-in-up overflow-hidden">
            <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h3 class="font-bold text-gray-800 text-lg">Yorumlar</h3>
                <button @click="closeCommentModal" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-600"><i class="fas fa-times"></i></button>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-4">
                <div class="flex gap-3 mb-6 bg-rose-50 p-3 rounded-xl border border-rose-100">
                    <div class="w-12 h-12 bg-white rounded-lg flex-shrink-0 overflow-hidden border border-rose-100">
                        <img v-if="activeModalItem.product?.imageUrl" :src="activeModalItem.product.imageUrl" class="w-full h-full object-cover">
                        <img v-else-if="activeModalItem.product?.image?.url" :src="config.public.apiBase.replace('/api','') + activeModalItem.product.image.url" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <p class="font-bold text-sm text-gray-800 line-clamp-1">{{ activeModalItem.product?.title }}</p>
                        <p class="text-xs text-gray-500 line-clamp-2">{{ activeModalItem.comment }}</p>
                    </div>
                </div>
                <div v-for="comment in activeModalItem.comments" :key="comment.id" class="flex gap-3">
                    <div class="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-indigo-100">{{ getInitials(comment.users_permissions_user?.username) }}</div>
                    <div class="flex-1">
                        <div class="flex items-baseline gap-2">
                            <span class="font-bold text-sm text-gray-900">{{ comment.users_permissions_user?.username || 'Anonim' }}</span>
                            <span class="text-[10px] text-gray-400">{{ formatDate(comment.createdAt) }}</span>
                        </div>
                        <p class="text-sm text-gray-600 mt-0.5 leading-relaxed">{{ comment.content }}</p>
                    </div>
                </div>
                 <div v-if="!activeModalItem.comments || activeModalItem.comments.length === 0" class="text-center py-10 text-gray-400 text-sm">Henüz yorum yapılmamış.</div>
            </div>
            <div class="p-3 border-t border-gray-100 bg-gray-50">
                 <div class="flex gap-2 items-center bg-white p-1.5 rounded-2xl border border-gray-200 focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-100 transition">
                    <div class="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-xs font-bold text-rose-600 ml-1">{{ user ? getInitials(user.username) : '?' }}</div>
                    <input v-model="activeModalItem.draftComment" type="text" placeholder="Yorum yap..." class="flex-1 bg-transparent py-2 px-2 text-sm focus:outline-none" @keyup.enter="submitComment(activeModalItem)">
                    <button @click="submitComment(activeModalItem)" :disabled="!activeModalItem.draftComment" class="bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-rose-700 transition disabled:opacity-50 disabled:cursor-not-allowed">Gönder</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'

const { request } = apiUse() 
const { logout, jwt, user } = useAuth()
const router = useRouter()
const config = useRuntimeConfig()

const recommendations = ref([])
const myProductTitles = ref(new Set()) // Kullanıcının ürün başlıklarını tutacağımız Set
const loading = ref(true)

// Modal State
const activeModalItem = ref(null)

const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : '?'
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })

const openCommentModal = (rec) => {
    activeModalItem.value = rec
    document.body.style.overflow = 'hidden'
}

const closeCommentModal = () => {
    activeModalItem.value = null
    document.body.style.overflow = 'auto'
}

// 1. KULLANICININ ÜRÜN LİSTESİNİ ÇEK
const fetchMyList = async () => {
    if (!user.value) return
    try {
        // Sadece başlıkları çekmek performans için daha iyi olur ama Strapi v4'te select biraz karışıktır,
        // şimdilik düz çekiyoruz.
        const res = await request('/api/products', { method: 'GET' })
        const products = res.data || []
        
        // Ürün başlıklarını küçük harfe çevirip Set'e atıyoruz (Hızlı arama için)
        myProductTitles.value = new Set(products.map(p => p.title.toLowerCase().trim()))
    } catch (e) {
        console.error('Kullanıcı listesi çekilemedi', e)
    }
}

// 2. ÖNERİLERİ ÇEK
const fetchRecs = async () => {
  if (!jwt.value) return router.push('/login')
  
  try {
    // Paralel olarak hem önerileri hem de kullanıcının listesini çekiyoruz
    const [recRes] = await Promise.all([
        request('/api/recommendations', { 
            method: 'GET',
            query: {
                populate: ['product', 'liked_by', 'comments', 'comments.users_permissions_user', 'recommender', 'user', 'product.image'],
                sort: ['createdAt:desc']
            }
        }),
        fetchMyList() // Kullanıcının listesini de güncelle
    ])
    
    recommendations.value = recRes.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchRecs)

// --- YARDIMCI: ÜRÜN LİSTEMDE VAR MI? ---
const isInMyList = (title) => {
    if (!title) return false
    return myProductTitles.value.has(title.toLowerCase().trim())
}

// --- LIKE İŞLEMİ ---
const isLiked = (rec) => {
    if (!rec.liked_by || !user.value) return false
    return rec.liked_by.some(u => u.id === user.value.id)
}

const handleLike = async (rec) => {
  const target = rec || activeModalItem.value; 
  if (!user.value) { Swal.fire('Uyarı', 'Giriş yapmalısınız.', 'warning'); return; }

  try {
    const res = await request(`/api/recommendations/${target.id}`, {
      method: 'PUT',
      body: { data: { action: 'toggle_like' } }
    });

    if (res.data && res.data.liked_by) {
       target.liked_by = res.data.liked_by;
    } else if (res.data && res.data.attributes?.liked_by?.data) {
       target.liked_by = res.data.attributes.liked_by.data;
    } else {
       fetchRecs(); 
    }
  } catch (e) {
    if (e.response?.status === 401) router.push('/login');
  }
}

// --- YORUM GÖNDERME ---
const submitComment = async (rec) => {
    if (!user.value) return Swal.fire('Uyarı', 'Giriş yapmalısınız.', 'warning')
    if (!rec.draftComment || !rec.draftComment.trim()) return

    try {
        await request('/api/comments', {
            method: 'POST',
            body: {
                data: {
                    content: rec.draftComment,
                    recommendation: rec.id,
                    users_permissions_user: user.value.id   
                }
            }
        })
        rec.draftComment = ''
        await fetchRecs()
        if (activeModalItem.value && activeModalItem.value.id === rec.id) {
             const updatedRec = recommendations.value.find(r => r.id === rec.id)
             if(updatedRec) activeModalItem.value = updatedRec
        }
        Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 }).fire({ icon: 'success', title: 'Yorum gönderildi' })
    } catch (e) {
        Swal.fire('Hata', 'Yorum gönderilemedi', 'error')
    }
}

// --- LİSTEYE EKLEME ---
const addToList = async (productData) => {
  if (!productData) return
  if (!user.value) return Swal.fire('Uyarı', 'Giriş yapmalısınız.', 'warning')

  const confirm = await Swal.fire({
    title: 'Listene Eklensin mi?',
    text: `${productData.title} alınacaklar listene kopyalanacak.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Evet, Ekle',
    confirmButtonColor: '#e11d48',
    cancelButtonText: 'Vazgeç'
  })

  if (confirm.isConfirmed) {
    try {
      await request('/api/products', {
        method: 'POST',
        body: {
          data: {
            title: productData.title,
            category: productData.category,
            price: productData.price,
            imageUrl: productData.imageUrl,
            link: productData.link,          
            is_purchased: false,
            is_template: false,
          }
        }
      })
      
      // Listeye ekler eklemez yerel listemizi güncelle
      myProductTitles.value.add(productData.title.toLowerCase().trim())
      
      Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 }).fire({ icon: 'success', title: 'Listene eklendi!' })
    } catch (e) {
      Swal.fire('Hata', 'Eklenemedi.', 'error')
    }
  }
}

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>