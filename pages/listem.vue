<template>
  <div class="bg-[#fff5f5] min-h-screen pb-20 font-sans">
    
    <header class="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-rose-100 shadow-sm">
      <div class="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        
        <NuxtLink to="/" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-500 transition shadow-sm border border-gray-100 group" title="Ana Sayfa">
          <i class="fas fa-compass text-lg group-hover:rotate-45 transition-transform duration-300"></i>
        </NuxtLink>
        
        <h1 class="text-lg font-bold text-gray-800 tracking-tight flex items-center gap-1 hidden sm:flex">
          <span class="bg-gradient-to-tr from-rose-400 to-pink-500 text-transparent bg-clip-text">Çeyiz Listem</span>
        </h1>
        
        <div class="flex items-center gap-2">
            <NuxtLink to="/oneriler" class="hidden sm:flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full text-xs font-bold border border-indigo-100 hover:bg-indigo-100 transition">
                <i class="fas fa-magic"></i>
                <span>Öneriler</span>
            </NuxtLink>
            <NuxtLink to="/oneriler" class="sm:hidden w-10 h-10 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition">
                <i class="fas fa-magic"></i>
            </NuxtLink>

            <button @click="toggleNotifications" class="w-10 h-10 rounded-full bg-white text-gray-600 border border-gray-100 hover:text-rose-500 hover:border-rose-100 transition shadow-sm flex items-center justify-center relative">
                <i class="far fa-bell text-lg"></i>
                <span v-if="notifications.filter(n => !n.read).length > 0" class="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <NuxtLink to="/profile" class="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-400 to-pink-500 p-0.5 shadow-md hover:scale-105 transition transform cursor-pointer">
                <div class="w-full h-full bg-white rounded-full flex items-center justify-center text-rose-500 font-bold text-sm">
                    {{ user ? getInitials(user.username) : '?' }}
                </div>
            </NuxtLink>
        </div>

      </div>
    </header>

    <div v-if="showNotifications" class="fixed inset-0 z-[60] flex items-start justify-center pt-20 px-4">
        <div class="absolute inset-0 bg-transparent" @click="showNotifications = false"></div>
        <div class="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-gray-100 relative z-10 overflow-hidden animate-fade-in-up max-h-[500px] flex flex-col">
            <div class="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 class="font-bold text-gray-800">Bildirimler</h3>
                <button @click="showNotifications = false" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
            </div>
            <div class="overflow-y-auto p-0">
                <div v-if="notifications.length === 0" class="p-8 text-center text-gray-400 text-sm">Henüz yeni bildirim yok.</div>
                <div v-else class="divide-y divide-gray-50">
                    <div v-for="(notif, index) in notifications" :key="index" class="p-4 hover:bg-rose-50/30 transition flex gap-3 items-start">
                        <div class="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold" :class="notif.type === 'like' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'">
                            <i :class="notif.type === 'like' ? 'fas fa-heart' : 'fas fa-comment'"></i>
                        </div>
                        <div>
                            <p class="text-sm text-gray-800"><span class="font-bold">{{ notif.actor }}</span> {{ notif.message }}</p>
                            <p class="text-xs text-gray-400 mt-1">{{ formatDate(notif.date) }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="max-w-3xl mx-auto px-4 py-6">

      <div class="grid grid-cols-2 gap-4 mb-8">
        <div class="bg-white p-4 rounded-3xl shadow-lg shadow-rose-100/40 border border-white flex flex-col items-center justify-center relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition">
              <i class="fas fa-shopping-basket text-6xl text-rose-500"></i>
          </div>
          <span class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Tahmini Tutar</span>
          <span class="text-xl font-extrabold text-gray-800 mb-2">{{ formatPrice(totalAlacakAmount) }}</span>
          <div class="bg-rose-50 text-rose-600 px-3 py-1 rounded-lg text-xs font-bold">
              {{ alacaklar.length }} Ürün Alınacak
          </div>
        </div>

        <div class="bg-white p-4 rounded-3xl shadow-lg shadow-green-100/40 border border-white flex flex-col items-center justify-center relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition">
              <i class="fas fa-check-circle text-6xl text-green-500"></i>
          </div>
          <span class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Harcanan</span>
          <span class="text-xl font-extrabold text-green-600 mb-2">{{ formatPrice(totalHarcananAmount) }}</span>
          <div class="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-xs font-bold">
              {{ alinanlar.length }} Ürün Tamam
          </div>
        </div>
      </div>

      <div class="mb-8">
         <button @click="openAddModal" class="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 rounded-2xl shadow-xl shadow-gray-200 flex items-center justify-between group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div class="flex items-center gap-4">
               <div class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center group-hover:bg-rose-500 transition-colors">
                 <i class="fas fa-plus"></i>
               </div>
               <div class="text-left">
                 <p class="font-bold text-lg">Yeni Ürün Ekle</p>
                 <p class="text-xs text-gray-400 font-medium">Listenize hızlıca ekleme yapın</p>
               </div>
            </div>
            <i class="fas fa-chevron-right text-gray-500 group-hover:text-white transition-colors pr-2"></i>
         </button>
      </div>

      <div class="mb-6 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <div class="flex gap-2 w-max">
          <button 
            v-for="cat in categories" 
            :key="cat"
            @click="selectedCategory = cat"
            :class="[
              'px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border',
              selectedCategory === cat 
                ? 'bg-gray-800 text-white border-gray-800 shadow-md transform scale-105' 
                : 'bg-white text-gray-500 border-gray-200 hover:border-rose-200 hover:text-rose-500'
            ]"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <div class="bg-white p-1.5 rounded-2xl shadow-sm border border-rose-100 mb-6 flex">
        <button 
          @click="activeTab = 'alacaklar'" 
          :class="['flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2', activeTab === 'alacaklar' ? 'bg-rose-50 text-rose-600 shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50']">
          Alınacaklar
        </button>
        <button 
          @click="activeTab = 'alinanlar'" 
          :class="['flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2', activeTab === 'alinanlar' ? 'bg-green-50 text-green-600 shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50']">
          Tamamlananlar
        </button>
      </div>

      <div class="space-y-4 min-h-[300px]">
        
        <div v-if="loading && myItems.length === 0" class="flex flex-col items-center justify-center py-12 space-y-4">
          <div class="w-10 h-10 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
          <p class="text-gray-400 text-sm font-medium animate-pulse">Listeniz hazırlanıyor...</p>
        </div>

        <div v-else-if="currentList.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
           <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-dashed border-gray-200 mx-auto">
             <i :class="['fas text-4xl text-gray-300', activeTab === 'alacaklar' ? 'fa-clipboard-list' : 'fa-clipboard-check']"></i>
           </div>
           <p class="text-gray-400 font-medium">Bu liste boş.</p>
        </div>

        <div v-else v-for="item in currentList" :key="item.id" 
             class="group bg-white p-3 rounded-2xl border border-transparent hover:border-rose-200 shadow-sm hover:shadow-lg transition-all duration-300">
           
           <div class="flex items-start gap-3">
             
             <div class="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 relative group-hover:border-rose-100 transition">
                 <img v-if="item.imageUrl" :src="item.imageUrl" class="w-full h-full object-cover" onerror="this.style.display='none'">
                 <img v-else-if="item.image?.url" :src="item.image.url.startsWith('http') ? item.image.url : config.public.apiBase.replace('/api','') + item.image.url" class="w-full h-full object-cover">                 
                 <div v-else class="w-full h-full flex items-center justify-center text-rose-200 bg-rose-50">
                    <i class="fas fa-camera text-2xl"></i>
                 </div>
                 <div v-if="item.is_purchased" class="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-[1px]">
                    <i class="fas fa-check-circle text-white text-3xl drop-shadow-md"></i>
                 </div>
             </div>

             <div class="flex-1 min-w-0 py-1">
                 <div class="flex justify-between items-start">
                   <h4 :class="['font-bold text-gray-800 text-base leading-snug truncate pr-2', item.is_purchased ? 'line-through text-gray-400' : '']">
                     {{ item.title }}
                   </h4>
                   
                   <div class="flex gap-2">
                     <button v-if="!item.is_template" @click="openEditModal(item)" class="text-gray-300 hover:text-blue-500 transition w-6 h-6 flex items-center justify-center">
                         <i class="fas fa-pen"></i>
                     </button>

                     <button v-if="!item.is_template" @click="deleteItem(item.id)" class="text-gray-300 hover:text-red-500 transition w-6 h-6 flex items-center justify-center">
                         <i class="far fa-trash-alt"></i>
                     </button>
                   </div>
                 </div>
                 
                 <div class="flex flex-wrap items-center gap-2 mt-2">
                   <span v-if="item.is_template" class="text-[10px] font-bold uppercase bg-purple-100 text-purple-600 px-2 py-1 rounded-md">
                     <i class="fas fa-magic mr-1"></i>Öneri
                   </span>

                   <span class="text-[10px] font-bold uppercase bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
                     {{ item.category || 'Genel' }}
                   </span>
                   
                   <span v-if="item.price" class="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
                     {{ formatPrice(item.price) }}
                   </span>
                 </div>

                 <div class="flex items-center gap-3 mt-3">
                     <button @click="toggleStatus(item)" :class="['text-xs font-bold px-3 py-1.5 rounded-lg transition border', item.is_purchased ? 'bg-white border-gray-200 text-gray-500' : 'bg-rose-600 border-rose-600 text-white shadow-md shadow-rose-200 hover:bg-rose-700']">
                        {{ item.is_purchased ? 'Geri Al' : 'Satın Alındı' }}
                     </button>

                     <button 
                        v-if="!item.my_recommendation_id" 
                        @click="recommendItem(item)" 
                        class="text-xs font-bold text-indigo-500 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition hover:bg-indigo-100">
                        <i class="fas fa-star mr-1"></i> Tavsiye
                    </button>

                    <button 
                        v-else 
                        @click="removeRecommendation(item)" 
                        class="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition hover:bg-red-100 group">
                        <span class="group-hover:hidden"><i class="fas fa-check mr-1"></i> Tavsiye Edildi</span>
                        <span class="hidden group-hover:inline"><i class="fas fa-times mr-1"></i> Tavsiyeyi Sil</span>
                    </button>

                     <a v-if="item.link" :href="item.link" target="_blank" class="text-gray-400 hover:text-blue-500 text-sm ml-auto px-2 py-1">
                       <i class="fas fa-external-link-alt"></i>
                     </a>
                 </div>
             </div>

           </div>
        </div>

        <div ref="loadMoreTrigger" class="h-10 w-full flex items-center justify-center mt-4">
            <div v-if="loadingMore" class="flex items-center gap-2 text-rose-500 text-sm font-bold">
                <div class="w-4 h-4 border-2 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
                Yükleniyor...
            </div>
            <div v-else-if="!hasMore && currentList.length > 0" class="text-xs text-gray-300">
                Tüm ürünler görüntülendi.
            </div>
        </div>

      </div>

    </div>
  </div>
</template>
<script setup lang="ts">
import Swal from 'sweetalert2'
import { shallowRef, triggerRef, computed, ref, onMounted, watch, onUnmounted } from 'vue'

const { request } = apiUse()
const { user, me } = useAuth()
const config = useRuntimeConfig()
const jwtCookie = useCookie('jwt') 

// --- STATE ---
// HIZLANDIRMA 1: 'shallowRef' kullanarak Vue'nun derinlemesine izlemesini kapatıyoruz.
const allItems = shallowRef<any[]>([]) 

const loading = ref(true)
const loadingMore = ref(false)
const activeTab = ref<'alacaklar' | 'alinanlar'>('alacaklar')
const selectedCategory = ref('Tümü')
const categories = ['Tümü','Hazırlık', 'Mutfak', 'Salon', 'Yatak Odası', 'Elektronik', 'Banyo', 'Diğer']

// Ekranda gösterilecek limit (Virtual Scroll benzeri mantık için)
const displayLimit = ref(20)

// Bildirimler
const showNotifications = ref(false)
const notifications = ref<any[]>([])

// Cache Anahtarı
const CACHE_KEY = 'my_ceyiz_smart_cache'

// --- INIT ---
onMounted(() => {
    // 1. Cache'den Yükle (Anında görüntü)
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
        try {
            allItems.value = JSON.parse(cached)
            loading.value = false
            console.log(`⚡ Cache: ${allItems.value.length} ürün yüklendi.`)
        } catch (e) { console.error('Cache hatası', e) }
    }

    // 2. API'den Tazele (Zincirleme Çekim)
    fetchList(true)
    
    // 3. Scroll Observer (Sonsuz Kaydırma - Limiti Artırma)
    observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loading.value) {
            loadMoreDisplay()
        }
    }, { threshold: 0.5 })
    
    setTimeout(() => {
        if (loadMoreTrigger.value) observer?.observe(loadMoreTrigger.value)
    }, 500)
})

const loadMoreDisplay = () => {
    if (displayLimit.value < filteredPool.value.length) {
        displayLimit.value += 20
    }
}

// --- FILTERING (GÖRÜNTÜLEME MANTIĞI) ---
// 1. Filtrelenmiş Havuz (Tüm veri üzerinden)
const filteredPool = computed(() => {
    let list = allItems.value
    const isPurchased = activeTab.value === 'alinanlar'
    list = list.filter(item => item.is_purchased === isPurchased)

    if (selectedCategory.value !== 'Tümü') {
        list = list.filter(item => item.category === selectedCategory.value)
    }
    return list
})

// 2. Ekrana Basılan (Limitli)
const currentList = computed(() => {
    return filteredPool.value.slice(0, displayLimit.value)
})

// Kategori değişince scroll başa
watch([activeTab, selectedCategory], () => {
    displayLimit.value = 20
})

// --- DATA FETCHING (ZİNCİRLEME / RECURSIVE FETCH) ---
const fetchList = async (reset = true) => {
    if (!reset && loading.value) return

    if (reset) {
        if (allItems.value.length === 0) loading.value = true
    }

    try {
        const ok = await ensureLoggedIn()
        if (!ok) return

        // 1. İLK PARTİ İSTEĞİ (İlk 500 ürün)
        // 500 adet çekiyoruz, tarayıcıyı yormadan ilk görüntüyü vermek için.
        const pageSizeLimit = 500 
        
        const queryParams: any = {
            'sort': 'createdAt:desc',
            'pagination[page]': 1,
            'pagination[pageSize]': pageSizeLimit,
            'filters[user][id][$eq]': user.value.id
        }

        const res: any = await request('/api/products', { method: 'GET', query: queryParams })
        
        let fetchedData = res?.data ?? []
        const meta = res?.meta?.pagination

        // --- TAVSİYE EŞLEŞTİRME YARDIMCISI ---
        const enrichWithRecommendations = async (items: any[]) => {
            const pIds = items.map((p: any) => p.id)
            if (pIds.length === 0) return items
            
            try {
                // ID'leri query string formatına çevir
                const recQuery: any = {
                    'pagination[pageSize]': pIds.length + 50,
                    'filters[user][id][$eq]': user.value.id,
                    'populate[product][fields][0]': 'id'
                }
                pIds.forEach((id: number, idx: number) => {
                    recQuery[`filters[product][id][$in][${idx}]`] = id
                })
                
                const recRes: any = await request('/api/recommendations', { method: 'GET', query: recQuery })
                const myRecs = recRes.data || []
                
                return items.map((prod: any) => {
                    const rec = myRecs.find((r: any) => r.product && String(r.product.id) === String(prod.id))
                    return { ...prod, my_recommendation_id: rec ? rec.id : null }
                })
            } catch(e) { return items }
        }

        // İlk partiyi eşleştir ve ekrana bas
        fetchedData = await enrichWithRecommendations(fetchedData)
        allItems.value = fetchedData 
        triggerRef(allItems) // Vue'ya "Veri değişti" de
        
        // 2. KALAN SAYFALARI ARKA PLANDA ÇEK (Zincirleme)
        if (meta && meta.pageCount > 1) {
            console.log(`📦 Toplam ${meta.total} ürün var. Kalan ${meta.pageCount - 1} sayfa arkada yükleniyor...`)
            
            for (let p = 2; p <= meta.pageCount; p++) {
                const nextQuery = { ...queryParams, 'pagination[page]': p }
                const nextRes: any = await request('/api/products', { method: 'GET', query: nextQuery })
                let nextItems = nextRes?.data ?? []
                
                // Gelen yeni paketi de eşleştir
                nextItems = await enrichWithRecommendations(nextItems)
                
                // Mevcut listenin altına ekle
                allItems.value = [...allItems.value, ...nextItems]
                triggerRef(allItems) 
            }
        }

        // 3. HEPSİ BİTİNCE CACHE GÜNCELLE
        localStorage.setItem(CACHE_KEY, JSON.stringify(allItems.value))
        
        if (reset) fetchNotifications()

    } catch (e) {
        console.error('Liste yükleme hatası', e)
    } finally {
        loading.value = false
    }
}

// --- NOTIFICATIONS ---
const fetchNotifications = async () => {
    if (!user.value) return
    try {
        const queryParams = {
            'filters[user][id][$eq]': user.value.id,
            'populate': ['liked_by', 'comments', 'comments.users_permissions_user', 'product'],
            'sort': 'createdAt:desc'
        }
        const res: any = await request('/api/recommendations', { method: 'GET', query: queryParams })
        const myRecs = res.data || []
        const tempNotifs: any[] = []
        myRecs.forEach((rec: any) => {
             if (rec.liked_by && Array.isArray(rec.liked_by)) {
                rec.liked_by.forEach((liker: any) => {
                    if (liker.id !== user.value.id) tempNotifs.push({ type: 'like', actor: liker.username, message: `"${rec.product?.title || 'paylaşımını'}" beğendi.`, date: rec.updatedAt, read: false })
                })
             }
             if (rec.comments && Array.isArray(rec.comments)) {
                rec.comments.forEach((comment: any) => {
                    if (comment.users_permissions_user?.id !== user.value.id) {
                        tempNotifs.push({
                            type: 'comment',
                            actor: comment.users_permissions_user?.username || 'Biri',
                            message: `"${rec.product?.title || 'paylaşımına'}" yorum yaptı.`,
                            content: comment.content,
                            date: comment.createdAt,
                            read: false
                        })
                    }
                })
            }
        })
        tempNotifs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        notifications.value = tempNotifs
    } catch(e) { console.error(e) }
}
const toggleNotifications = () => showNotifications.value = !showNotifications.value


// --- CRUD İŞLEMLERİ (CACHE GÜNCELLEMELİ) ---

const deleteItem = async (id: number) => {
  if(confirm('Silinsin mi?')) { 
      allItems.value = allItems.value.filter(i => i.id !== id)
      triggerRef(allItems)
      localStorage.setItem(CACHE_KEY, JSON.stringify(allItems.value))

      try { await request(`/api/products/${id}`, { method: 'DELETE' }); } 
      catch(e) { fetchList(true) }
  }
}

const toggleStatus = async (item: any) => {
    if (item.is_template) {
        try { 
            await request('/api/products', { 
                method: 'POST', 
                body: { data: { title: item.title, category: item.category, imageUrl: item.imageUrl, price: item.price, link: item.link, is_purchased: true, is_template: false } } 
            })
            Swal.mixin({ toast: true, position: 'center', showConfirmButton: false, timer: 1500 }).fire({ icon: 'success', title: 'Listene Alındı!' })
            fetchList(true) 
        } catch (e) { Swal.fire('Hata', 'İşlem yapılamadı', 'error') } 
        return 
    }

    const newStatus = !item.is_purchased
    
    // UI Güncelle
    const target = allItems.value.find(i => i.id === item.id)
    if (target) {
        target.is_purchased = newStatus
        triggerRef(allItems)
        localStorage.setItem(CACHE_KEY, JSON.stringify(allItems.value))
    }

    try { 
        await request(`/api/products/${item.id}`, { 
            method: 'PUT', 
            body: { data: { is_purchased: newStatus } } 
        })
        if(newStatus) Swal.mixin({ toast: true, position: 'center', showConfirmButton: false, timer: 1500 }).fire({ icon: 'success', title: 'Harika!' }) 
    } catch (e) { 
        if(target) target.is_purchased = !newStatus 
        fetchList(true)
    }
}

const recommendItem = async (item: any) => {
  const { value: text } = await Swal.fire({ 
      title: 'Tavsiyeni Paylaş', 
      input: 'textarea', 
      inputPlaceholder: 'Düşüncelerin neler?', 
      confirmButtonText: 'Paylaş', 
      confirmButtonColor: '#e11d48', 
      showCancelButton: true, 
      cancelButtonText: 'Vazgeç' 
  })
  
  if (text) {
    try { 
        const res: any = await request('/api/recommendations', { 
            method: 'POST', 
            body: { data: { comment: text, product: item.id } } 
        })
        
        const target = allItems.value.find(i => i.id === item.id)
        if(target) {
            target.my_recommendation_id = res.data?.id || res.id
            triggerRef(allItems)
            localStorage.setItem(CACHE_KEY, JSON.stringify(allItems.value))
        }

        Swal.fire({ toast: true, position: 'center', icon: 'success', title: 'Tavsiyen paylaşıldı!', showConfirmButton: false, timer: 2000 }) 
    } catch (e) { Swal.fire('Hata', 'Paylaşım yapılamadı.', 'error') } 
  }
}

const removeRecommendation = async (item: any) => {
    if(!item.my_recommendation_id) return
    const confirm = await Swal.fire({ title: 'Tavsiyeni Kaldır', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Evet, Sil' })

    if (confirm.isConfirmed) {
        try {
            await request(`/api/recommendations/${item.my_recommendation_id}`, { method: 'DELETE' })
            const target = allItems.value.find(i => i.id === item.id)
            if(target) {
                target.my_recommendation_id = null
                triggerRef(allItems)
                localStorage.setItem(CACHE_KEY, JSON.stringify(allItems.value))
            }
            Swal.mixin({ toast: true, position: 'center', showConfirmButton: false, timer: 1500 }).fire({ icon: 'success', title: 'Silindi' })
        } catch (e) { Swal.fire('Hata', 'Silinemedi.', 'error') }
    }
}

const openEditModal = async (item: any) => {
  const categories = ['Hazırlık','Mutfak', 'Salon', 'Yatak Odası', 'Elektronik', 'Banyo', 'Diğer']
  const { value: values } = await Swal.fire({
    title: 'Ürünü Düzenle',
    html: `
      <div class="text-left space-y-3 p-1">
        <input id="sw-title" class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Ürün Adı" value="${item.title}">
        <select id="sw-category" class="w-full px-3 py-2 border rounded-lg text-sm bg-white">
           ${categories.map(c => `<option value="${c}" ${c === item.category ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
        <div class="border border-dashed border-gray-300 rounded-lg p-3 bg-gray-50 text-center relative">
            <input type="file" id="sw-file" accept="image/*" class="absolute inset-0 w-full h-full cursor-pointer z-10 opacity-0">
            <div class="text-gray-500 text-sm" id="sw-file-label"><i class="fas fa-cloud-upload-alt text-2xl mb-1 text-rose-400"></i><br>Fotoğraf Değiştir</div>
        </div>
        <div class="text-center text-xs text-gray-400 font-bold">- VEYA -</div>
        <input id="sw-image" class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Resim Linki" value="${item.imageUrl || ''}">
        <div class="grid grid-cols-2 gap-2">
           <input id="sw-price" type="number" class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Fiyat" value="${item.price || ''}">
           <input id="sw-link" class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Link" value="${item.link || ''}">
        </div>
        <div class="flex items-center gap-2 pt-2">
           <input id="sw-purchased" type="checkbox" class="w-4 h-4 text-rose-600 rounded" ${item.is_purchased ? 'checked' : ''}> 
           <label for="sw-purchased" class="text-sm">Satın Aldım</label>
        </div>
      </div>
    `,
    didOpen: () => {
        const fileInput = document.getElementById('sw-file') as HTMLInputElement
        const label = document.getElementById('sw-file-label')
        if(fileInput && label) {
            fileInput.addEventListener('change', (e: any) => { if (e.target.files.length > 0) label.innerHTML = `<i class="fas fa-check text-green-500"></i> ${e.target.files[0].name}` })
        }
    },
    showCancelButton: true,
    confirmButtonText: 'Güncelle',
    confirmButtonColor: '#3b82f6',
    preConfirm: () => {
      const title = (document.getElementById('sw-title') as HTMLInputElement)?.value?.trim()
      const category = (document.getElementById('sw-category') as HTMLSelectElement)?.value
      const imageUrl = (document.getElementById('sw-image') as HTMLInputElement)?.value?.trim()
      const fileInput = (document.getElementById('sw-file') as HTMLInputElement)
      const priceRaw = (document.getElementById('sw-price') as HTMLInputElement)?.value
      const link = (document.getElementById('sw-link') as HTMLInputElement)?.value?.trim()
      const is_purchased = (document.getElementById('sw-purchased') as HTMLInputElement)?.checked
      if (!title) { Swal.showValidationMessage('Ürün adı giriniz'); return }
      const file = fileInput.files?.length ? fileInput.files[0] : null
      return { title, category, imageUrl, file, priceRaw, link, is_purchased }
    }
  })

  if (!values) return
  Swal.fire({ title: 'Güncelleniyor...', didOpen: () => Swal.showLoading() })

  try {
    let uploadedImageId = item.image?.id || null 
    if (values.file) {
        const formData = new FormData()
        formData.append('files', values.file)
        const uploadRes: any = await $fetch(`${config.public.apiBase}/api/upload`, { method: 'POST', headers: { Authorization: `Bearer ${jwtCookie.value}` }, body: formData })
        if (uploadRes && uploadRes[0]) uploadedImageId = uploadRes[0].id
    } else if (values.imageUrl) { uploadedImageId = null; }

    const price = values.priceRaw ? Number(values.priceRaw) : 0
    await request(`/api/products/${item.id}`, {
      method: 'PUT',
      body: { data: { title: values.title, category: values.category, imageUrl: values.imageUrl, image: uploadedImageId, price: price, link: values.link || null, is_purchased: !!values.is_purchased } },
    })

    const target = allItems.value.find(i => i.id === item.id)
    if(target) {
        target.title = values.title
        target.category = values.category
        target.price = price
        target.imageUrl = values.imageUrl
        target.is_purchased = !!values.is_purchased
    }
    triggerRef(allItems)
    localStorage.setItem(CACHE_KEY, JSON.stringify(allItems.value))

    Swal.mixin({ toast: true, position: 'bottom-end', showConfirmButton: false, timer: 2000 }).fire({ icon: 'success', title: 'Güncellendi' })
  } catch (e: any) { Swal.fire('Hata', `Güncelleme hatası: ${e.message}`, 'error') }
}

const openAddModal = async () => {
  const categories = ['Hazırlık','Mutfak', 'Salon', 'Yatak Odası', 'Elektronik', 'Banyo', 'Diğer']
  const { value: values } = await Swal.fire({
    title: 'Yeni Ürün',
    html: `
      <div class="text-left space-y-3 p-1">
        <input id="sw-title" class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Ürün Adı (Zorunlu)">
        <select id="sw-category" class="w-full px-3 py-2 border rounded-lg text-sm bg-white">
           ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <div class="border border-dashed border-gray-300 rounded-lg p-3 bg-gray-50 text-center relative">
            <input type="file" id="sw-file" accept="image/*" class="absolute inset-0 w-full h-full cursor-pointer z-10 opacity-0">
            <div class="text-gray-500 text-sm" id="sw-file-label"><i class="fas fa-cloud-upload-alt text-2xl mb-1 text-rose-400"></i><br>Bilgisayardan Fotoğraf Seç</div>
        </div>
        <div class="text-center text-xs text-gray-400 font-bold">- VEYA -</div>
        <input id="sw-image" class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Resim Linki">
        <div class="grid grid-cols-2 gap-2">
           <input id="sw-price" type="number" class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Fiyat">
           <input id="sw-link" class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Link">
        </div>
        <div class="flex items-center gap-2 pt-2">
           <input id="sw-purchased" type="checkbox" class="w-4 h-4 text-rose-600 rounded"> 
           <label for="sw-purchased" class="text-sm">Satın Aldım</label>
        </div>
      </div>
    `,
    didOpen: () => {
        const fileInput = document.getElementById('sw-file') as HTMLInputElement
        const urlInput = document.getElementById('sw-image') as HTMLInputElement
        const label = document.getElementById('sw-file-label')
        if(fileInput && urlInput && label) {
            fileInput.addEventListener('change', (e: any) => { if (e.target.files.length > 0) { label.innerHTML = `<i class="fas fa-check text-green-500"></i> ${e.target.files[0].name}`; urlInput.value = '' } })
            urlInput.addEventListener('input', () => { if(urlInput.value.length > 0) { fileInput.value = ''; label.innerHTML = `<i class="fas fa-cloud-upload-alt text-2xl mb-1 text-rose-400"></i><br>Bilgisayardan Fotoğraf Seç` } })
        }
    },
    showCancelButton: true,
    confirmButtonText: 'Kaydet',
    confirmButtonColor: '#e11d48',
    preConfirm: () => {
      const title = (document.getElementById('sw-title') as HTMLInputElement)?.value?.trim()
      const category = (document.getElementById('sw-category') as HTMLSelectElement)?.value
      const imageUrl = (document.getElementById('sw-image') as HTMLInputElement)?.value?.trim()
      const fileInput = (document.getElementById('sw-file') as HTMLInputElement)
      const priceRaw = (document.getElementById('sw-price') as HTMLInputElement)?.value
      const link = (document.getElementById('sw-link') as HTMLInputElement)?.value?.trim()
      const is_purchased = (document.getElementById('sw-purchased') as HTMLInputElement)?.checked
      if (!title) { Swal.showValidationMessage('Ürün adı giriniz'); return }
      const file = fileInput.files?.length ? fileInput.files[0] : null
      return { title, category, imageUrl, file, priceRaw, link, is_purchased }
    }
  })

  if (!values) return
  Swal.fire({ title: 'Kaydediliyor...', didOpen: () => Swal.showLoading() })

  try {
    let uploadedImageId = null
    if (values.file) {
        const formData = new FormData()
        formData.append('files', values.file)
        const uploadRes: any = await $fetch(`${config.public.apiBase}/api/upload`, { method: 'POST', headers: { Authorization: `Bearer ${jwtCookie.value}` }, body: formData })
        if (uploadRes && uploadRes[0]) uploadedImageId = uploadRes[0].id
    }
    const price = values.priceRaw ? Number(values.priceRaw) : 0
    await request('/api/products', {
      method: 'POST',
      body: { data: { title: values.title, category: values.category, imageUrl: values.imageUrl, image: uploadedImageId, price: price, link: values.link || null, is_purchased: !!values.is_purchased, is_template: false } },
    })
    
    // Ekleme sonrası listeyi ve cache'i tazele
    await fetchList(true) 
    
    Swal.mixin({ toast: true, position: 'bottom-end', showConfirmButton: false, timer: 2000 }).fire({ icon: 'success', title: 'Eklendi' })
  } catch (e: any) { Swal.fire('Hata', `Hata oluştu: ${e.message}`, 'error') }
}

const ensureLoggedIn = async () => {
  if (!user.value) await me().catch(() => null)
  if (!user.value?.id) { await navigateTo('/login'); return false }
  return true
}
const loadMoreTrigger = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null
const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : '?'
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
const formatPrice = (price: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price)

// Computed
const totalAlacakAmount = computed(() => allItems.value.filter(i => !i.is_purchased).reduce((sum, item) => sum + (Number(item.price)||0), 0))
const totalHarcananAmount = computed(() => allItems.value.filter(i => i.is_purchased).reduce((sum, item) => sum + (Number(item.price)||0), 0))
// hasMore template'de kullanılıyor, onu da expose ediyoruz
const hasMore = computed(() => displayLimit.value < filteredPool.value.length)

// Template için
const alacaklar = computed(() => allItems.value.filter(i => !i.is_purchased)) 
const alinanlar = computed(() => allItems.value.filter(i => i.is_purchased))
const totalItems = ref(0) // Eski kodla uyumluluk (zaten meta'dan güncellenmiyor artık)

</script>