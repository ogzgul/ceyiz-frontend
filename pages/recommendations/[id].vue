<template>
  <div class="bg-gray-50 min-h-screen pb-20 font-sans">

    <nav class="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-rose-100 px-4 py-3 flex items-center gap-4">
      <button @click="router.back()" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-600">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h1 class="font-bold text-gray-800 text-lg">Öneri Detayı</h1>
    </nav>

    <div v-if="loading" class="flex flex-col items-center justify-center h-[60vh] text-gray-400">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500 mb-4"></div>
      <p>Yükleniyor...</p>
    </div>

    <div v-else-if="item" class="max-w-2xl mx-auto px-4 py-6 animate-fade-in">

      <div class="bg-white rounded-3xl shadow-xl shadow-gray-100 overflow-hidden mb-6 border border-gray-100">
        
        <div class="relative h-72 bg-gray-50 flex items-center justify-center overflow-hidden group">
          <img 
            v-if="item.product?.imageUrl" 
            :src="item.product.imageUrl" 
            class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            onerror="this.style.display='none'"
          >
          <img 
            v-else-if="item.product?.image?.url" 
            :src="config.public.apiBase.replace('/api','') + item.product.image.url" 
            class="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          >
          <div v-else class="text-gray-300 flex flex-col items-center">
            <i class="fas fa-image text-5xl mb-2"></i>
            <span class="text-sm">Resim Yok</span>
          </div>

          <div v-if="item.product?.price" class="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-rose-600 font-extrabold px-4 py-2 rounded-2xl shadow-lg border border-rose-100">
            ₺{{ item.product.price }}
          </div>
        </div>

        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h1 class="text-2xl font-bold text-gray-800 leading-tight">
              {{ item.product?.title || 'Ürün Başlığı Yok' }}
            </h1>
          </div>

          <div class="flex gap-3 mb-6">
            <a 
              v-if="item.product?.link" 
              :href="item.product.link" 
              target="_blank" 
              class="flex-1 bg-blue-50 text-blue-600 py-3 rounded-xl font-bold text-sm hover:bg-blue-100 transition flex items-center justify-center gap-2"
            >
              Ürüne Git <i class="fas fa-external-link-alt"></i>
            </a>
            <button 
              @click="addToList(item.product)" 
              class="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
            >
              Listeme Ekle <i class="fas fa-plus"></i>
            </button>
          </div>

          <div class="bg-rose-50/50 p-5 rounded-2xl border border-rose-100 relative">
            <i class="fas fa-quote-left absolute -top-3 left-4 text-rose-400 bg-white p-1 rounded-full border border-rose-100 text-lg"></i>
            
            <div class="flex items-center gap-2 mb-2">
              <div class="w-6 h-6 rounded-full bg-rose-200 flex items-center justify-center text-[10px] font-bold text-rose-700">
                {{ getInitials(item.user?.username) }}
              </div>
              <span class="font-bold text-gray-800 text-sm">
                {{ item.user?.username || 'Anonim' }}
              </span>
              <span class="text-xs text-gray-500">tavsiyesi:</span>
            </div>
            
            <p class="text-gray-700 leading-relaxed text-sm">
              {{ item.comment || item.description }}
            </p>
          </div>

          <div class="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
             <button 
                @click="toggleLike" 
                class="flex items-center gap-2 px-4 py-2 rounded-full transition-all active:scale-95"
                :class="isLikedByMe ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
             >
                <i class="fas fa-heart text-lg" :class="isLikedByMe ? 'fas' : 'far'"></i>
                <span class="font-bold">{{ item.liked_by?.length || 0 }} Beğeni</span>
             </button>
             <span class="text-xs text-gray-400">{{ formatDate(item.createdAt) }}</span>
          </div>

        </div>
      </div>

      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <h3 class="font-bold text-gray-800 text-lg mb-6 flex items-center gap-2">
          <i class="far fa-comments text-indigo-500"></i>
          Yorumlar <span class="text-gray-400 text-sm font-normal">({{ item.comments?.length || 0 }})</span>
        </h3>

        <div class="space-y-6 mb-8">
          <div v-for="comment in item.comments" :key="comment.id" class="flex gap-3 group">
            <div class="w-10 h-10 flex-shrink-0 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">
               {{ getInitials(comment.users_permissions_user?.username) }}
            </div>
            
            <div class="flex-1">
               <div class="bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-gray-100 group-hover:border-indigo-100 transition">
                  <div class="flex justify-between items-center mb-1">
                    <span class="font-bold text-gray-900 text-sm">
                      {{ comment.users_permissions_user?.username || 'Misafir' }}
                    </span>
                    <span class="text-[10px] text-gray-400">
                      {{ formatDate(comment.createdAt) }}
                    </span>
                  </div>
                  <p class="text-gray-600 text-sm leading-relaxed">{{ comment.content }}</p>
               </div>
            </div>
          </div>

          <div v-if="!item.comments || item.comments.length === 0" class="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p class="text-gray-400 text-sm">Henüz yorum yapılmamış. İlk yorumu sen yap!</p>
          </div>
        </div>

        <div class="relative">
           <textarea 
             v-model="newComment"
             rows="3"
             placeholder="Bu tavsiye hakkında ne düşünüyorsun?"
             class="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 resize-none transition"
           ></textarea>
           <div class="absolute bottom-3 right-3">
             <button 
               @click="postComment" 
               :disabled="!newComment.trim()"
               class="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
             >
               Gönder <i class="fas fa-paper-plane ml-1"></i>
             </button>
           </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import Swal from 'sweetalert2'

// Gerekli araçları çağırıyoruz
const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { request } = apiUse() 
const { user } = useAuth() // Giriş yapmış kullanıcı bilgisi

// State (Durum) Değişkenleri
const item = ref(null)
const loading = ref(true)
const newComment = ref('')

// Yardımcı Fonksiyonlar
const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : '?'
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
// [id].vue içindeki fetchDetail fonksiyonunu bununla değiştir:
// ... önceki kodlar ...
// [id].vue içindeki fetchDetail fonksiyonu:

const fetchDetail = async () => {
  const id = route.params.id;
  if (!id) return;

  try {
    // DÜZELTME: Populate verisini Nuxt'un otomatik diziye çevireceği formatta veriyoruz.
    // Bu format URL'de 'populate[]=product&populate[]=user...' şekline dönüşür ve Strapi bunu kabul eder.
    const queryParams = {
      populate: [
        'product', 
        'product.image', 
        'user', 
        'liked_by', 
        'comments', 
        'comments.users_permissions_user' // Yorum yazarının alan adı
      ],
      publicationState: 'preview',
    };

    const res = await request(`/api/recommendations/${id}`, {
      method: 'GET',
      params: queryParams // 'query' yerine 'params' kullanıyoruz, Nuxt/Fetch bunu doğru işler.
    });

    if (!res.data) throw new Error('Veri yok');
    item.value = res.data;

  } catch (e) {
    console.error('Detay çekme hatası:', e);
    
    if (e.response?.status === 404) {
        Swal.fire({
            icon: 'error',
            title: 'Bulunamadı',
            text: 'Bu içerik silinmiş olabilir.',
            confirmButtonText: 'Geri Dön'
        }).then(() => router.back());
    } else {
        // 400 hatası olursa konsolda URL'i kontrol etmek için:
        console.log('Hatalı URL:', e.request?.url);
    }
  } finally {
    loading.value = false;
  }
}
// ... sonraki kodlar ...
// Sayfa açılınca veriyi çek
onMounted(fetchDetail)

// --- 2. BEĞENME (LIKE) İŞLEMİ ---
const isLikedByMe = computed(() => {
  if (!item.value || !user.value) return false
  return item.value.liked_by?.some(u => u.id === user.value.id)
})
// [id].vue ve index.vue içindeki Like fonksiyonunu bununla değiştir:
// index.vue ve [id].vue içindeki Like fonksiyonu:

const handleLike = async (rec) => {
  // [id].vue sayfasında parametre gelmezse 'item.value' kullanılır
  const target = rec || item.value;
  
  if (!user.value) {
    Swal.fire('Uyarı', 'Beğenmek için giriş yapmalısınız.', 'warning');
    return;
  }

  try {
    // Backend'e ID listesi DEĞİL, sadece "toggle_like" eylemi gönderiyoruz.
    // Bu sayede "Başkasına ait gönderiyi güncelleme" hatası (401) almayız.
    const res = await request(`/api/recommendations/${target.id}`, {
      method: 'PUT',
      body: {
        data: {
          action: 'toggle_like' 
        }
      }
    });

    // Başarılı olursa arayüzdeki sayıyı güncelle (Sayfa yenilemeye gerek kalmaz)
    // Backend'den dönen güncel like listesini alıyoruz
    if (res.data && res.data.liked_by) {
       target.liked_by = res.data.liked_by;
    } else if (res.data && res.data.attributes?.liked_by?.data) {
       target.liked_by = res.data.attributes.liked_by.data;
    } else {
       // Garanti olsun diye yenile
       if (rec) { /* index.vue ise */ 
          // fetchRecs() // istersen açabilirsin
       } else { /* id.vue ise */
          fetchDetail();
       }
    }

  } catch (e) {
    console.error('Like hatası:', e);
    // Hata durumunda (Örn: Token süresi dolduysa) kullanıcıyı uyar
    if (e.response?.status === 401) {
        Swal.fire('Oturum Hatası', 'Lütfen tekrar giriş yapın.', 'error');
        router.push('/login');
    }
  }
}

// --- 3. YORUM YAPMA İŞLEMİ ---
const postComment = async () => {
  if (!user.value) return Swal.fire('Giriş Yapmalısın', 'Yorum yapmak için lütfen giriş yap.', 'warning')
  if (!newComment.value.trim()) return

  try {
    await request('/api/comments', {
      method: 'POST',
      body: {
        data: {
          content: newComment.value,
          recommendation: item.value.id,
          // Senin şemanda yorum yazarının alan adı: users_permissions_user
          users_permissions_user: user.value.id 
        }
      }
    })

    newComment.value = '' // Kutuyu temizle
    await fetchDetail() // Listeyi yenile

    // Başarı Mesajı (Toast)
    Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    }).fire({
      icon: 'success',
      title: 'Yorumun eklendi!'
    })

  } catch (e) {
    console.error('Yorum hatası:', e)
    Swal.fire('Hata', 'Yorum gönderilemedi.', 'error')
  }
}

// --- 4. LİSTEME EKLE İŞLEMİ ---
const addToList = async (productData) => {
  if (!productData) return
  if (!user.value) return Swal.fire('Giriş Yapmalısın', 'Listene eklemek için giriş yap.', 'warning')

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
            is_template: false
            // user ilişkisi Strapi tarafından backend'de otomatik kurulur (genellikle)
            // kurulmuyorsa buraya 'users_permissions_user: user.value.id' eklenebilir.
          }
        }
      })
      
      Swal.mixin({
        toast: true, position: 'top-end', showConfirmButton: false, timer: 1500
      }).fire({ icon: 'success', title: 'Listene eklendi!' })
      
    } catch (e) {
      console.error(e)
      Swal.fire('Hata', 'Eklenemedi.', 'error')
    }
  }
}
</script>

<style scoped>
/* Basit bir giriş animasyonu */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>