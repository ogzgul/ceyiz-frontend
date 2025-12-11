<template>
  <div class="bg-gray-50 min-h-screen pb-20 font-sans">
    
    <nav class="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-rose-100">
      <div class="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center gap-3">
            <NuxtLink to="/listem" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-rose-100 hover:text-rose-500 transition">
                <i class="fas fa-arrow-left"></i>
            </NuxtLink>
            <h1 class="text-xl font-bold text-gray-800">Çeyiz Önerileri</h1>
        </div>
        <button @click="forceRefresh" class="text-xs text-rose-500 font-bold hover:bg-rose-50 px-3 py-1 rounded-lg transition" title="Listeyi Güncelle">
            <i class="fas fa-sync-alt mr-1"></i> Güncelle
        </button>
      </div>
    </nav>

    <div class="max-w-3xl mx-auto px-4 py-6 space-y-8">

      <div v-if="loading" class="flex flex-col items-center justify-center py-20 text-gray-400 animate-fade-in">
         <div class="relative w-16 h-16 mb-4">
             <div class="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
             <div class="absolute inset-0 border-4 border-rose-500 rounded-full border-t-transparent animate-spin"></div>
             <i class="fas fa-clipboard-list absolute inset-0 flex items-center justify-center text-rose-500 text-xl"></i>
         </div>
         <span class="text-sm font-medium text-gray-500">Listeniz hazırlanıyor...</span>
         <span class="text-xs text-gray-400 mt-1">Bu işlem sadece ilk açılışta yapılır.</span>
      </div>

      <div v-else v-for="(items, category) in mockSuggestions" :key="category" class="animate-fade-in-up">
        
        <h2 class="text-lg font-extrabold text-gray-800 mb-3 flex items-center gap-2 sticky top-16 bg-gray-50/95 backdrop-blur py-2 z-10 pl-1">
            <span class="w-1 h-6 bg-rose-500 rounded-full"></span>
            {{ category }}
            <span class="text-xs font-normal text-gray-400 bg-white px-2 py-0.5 rounded-full border">
                {{ items.length }} Öneri
            </span>
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div v-for="item in items" :key="item.title" 
                 class="bg-white p-4 rounded-2xl shadow-sm border transition-all duration-300 relative overflow-hidden group/card"
                 :class="getStatus(item.title).exists ? 'border-green-200 bg-green-50/30' : 'border-gray-100 hover:border-rose-200'">
                
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-bold text-gray-800">{{ item.title }}</h3>
                        <p class="text-xs text-gray-400 mt-0.5">Ortalama: {{ item.avgPrice }}</p>
                    </div>
                    
                    <div v-if="getStatus(item.title).exists" class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shadow-sm animate-bounce-short">
                        <i class="fas fa-check"></i>
                    </div>
                    <div v-else class="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center group-hover/card:bg-rose-50 group-hover/card:text-rose-500 transition">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                </div>

                <div class="mt-4 pt-3 border-t border-gray-100/50 flex flex-col gap-2">
                    
                    <div v-if="getStatus(item.title).exists" class="text-xs text-orange-600 bg-orange-50 font-medium flex items-start gap-2 p-2 rounded-lg border border-orange-100">
                        <i class="fas fa-exclamation-circle mt-0.5"></i>
                        <div>
                            Listende benzer ürün var:<br>
                            <span class="font-bold text-orange-800">{{ getStatus(item.title).matchName }}</span>
                        </div>
                    </div>

                    <button @click="openAddModal(item)" 
                            class="w-full py-2.5 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 group"
                            :class="getStatus(item.title).exists 
                                ? 'bg-orange-100 text-orange-600 hover:bg-orange-500 hover:text-white' 
                                : 'bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white'">
                        
                        <span>{{ getStatus(item.title).exists ? 'Yine de Ekle' : 'Listeme Ekle' }}</span>
                        
                        <i class="fas fa-plus group-hover:rotate-90 transition-transform"></i>
                    </button>

                </div>
            </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'

const { request } = apiUse()
const { user, me } = useAuth()
const config = useRuntimeConfig()
const jwtCookie = useCookie('jwt')

const loading = ref(true)
const myProducts = ref<any[]>([])
const CACHE_KEY = 'my_ceyiz_products_cache' // LocalStorage Anahtarı

// --- MOCK DATA: ÖNERİ LİSTESİ ---
const mockSuggestions = {
    'Hazırlık': [
        // Kesme & Doğrama
        { title: 'Bıçak Seti (Standlı)', category: 'Hazırlık', avgPrice: '3.500 ₺' },
        { title: 'Şef Bıçağı', category: 'Hazırlık', avgPrice: '750 ₺' },
        { title: 'Ekmek Bıçağı', category: 'Hazırlık', avgPrice: '400 ₺' },
        { title: 'Meyve Bıçağı Seti (6\'lı)', category: 'Hazırlık', avgPrice: '300 ₺' },
        { title: 'Kesme Tahtası (Ahşap)', category: 'Hazırlık', avgPrice: '400 ₺' },
        { title: 'Kesme Tahtası (Plastik/Et İçin)', category: 'Hazırlık', avgPrice: '200 ₺' },
        { title: 'Satır', category: 'Hazırlık', avgPrice: '500 ₺' },
        { title: 'Mutfak Makası', category: 'Hazırlık', avgPrice: '150 ₺' },
        { title: 'Bileyici / Masat', category: 'Hazırlık', avgPrice: '200 ₺' },
        
        // Hazırlık Gereçleri
        { title: 'Rende (Paslanmaz Çelik)', category: 'Hazırlık', avgPrice: '250 ₺' },
        { title: 'Soyacak (Yan/Düz)', category: 'Hazırlık', avgPrice: '75 ₺' },
        { title: 'Sarımsak Ezici', category: 'Hazırlık', avgPrice: '150 ₺' },
        { title: 'Limon Sıkacağı (Manuel)', category: 'Hazırlık', avgPrice: '100 ₺' },
        { title: 'Havan (Ahşap/Mermer)', category: 'Hazırlık', avgPrice: '350 ₺' },
        { title: 'Ceviz Kıracağı', category: 'Hazırlık', avgPrice: '150 ₺' },
        { title: 'Konserve Açacağı', category: 'Hazırlık', avgPrice: '120 ₺' },
        { title: 'Tırbuşon', category: 'Hazırlık', avgPrice: '150 ₺' },
        { title: 'Fındık/Zeytin Çekirdek Çıkarıcı', category: 'Hazırlık', avgPrice: '100 ₺' },
        { title: 'Patates Ezici', category: 'Hazırlık', avgPrice: '150 ₺' },
        { title: 'Sebze Kurutucu', category: 'Hazırlık', avgPrice: '300 ₺' },
        
        // Ölçü & Karıştırma
        { title: 'Karıştırma Kabı Seti (Çelik)', category: 'Hazırlık', avgPrice: '1.200 ₺' },
        { title: 'Ölçü Kabı (Cam)', category: 'Hazırlık', avgPrice: '150 ₺' },
        { title: 'Ölçü Kaşıkları Seti', category: 'Hazırlık', avgPrice: '100 ₺' },
        { title: 'Mutfak Tartısı (Dijital)', category: 'Hazırlık', avgPrice: '300 ₺' },
        { title: 'Çırpıcı (Tel)', category: 'Hazırlık', avgPrice: '100 ₺' },
        { title: 'Spatula Seti (Silikon)', category: 'Hazırlık', avgPrice: '400 ₺' },
        { title: 'Yumurta Fırçası', category: 'Hazırlık', avgPrice: '50 ₺' },
        
        // Süzme & Eleme
        { title: 'Süzgeç Seti (Metal)', category: 'Hazırlık', avgPrice: '400 ₺' },
        { title: 'Makarna Süzgeci', category: 'Hazırlık', avgPrice: '250 ₺' },
        { title: 'Çay Süzgeci', category: 'Hazırlık', avgPrice: '50 ₺' },
        { title: 'Un Eleği', category: 'Hazırlık', avgPrice: '120 ₺' },
        { title: 'Pirinç Süzgeci', category: 'Hazırlık', avgPrice: '100 ₺' },
        
        // Pastacılık
        { title: 'Oklava', category: 'Hazırlık', avgPrice: '100 ₺' },
        { title: 'Merdane', category: 'Hazırlık', avgPrice: '150 ₺' },
        { title: 'Hamur Matı (Silikon)', category: 'Hazırlık', avgPrice: '200 ₺' },
        { title: 'Krema Sıkma Torbası Seti', category: 'Hazırlık', avgPrice: '150 ₺' },
        { title: 'Kurabiye Kalıpları', category: 'Hazırlık', avgPrice: '150 ₺' },
        { title: 'Tart Kalıbı', category: 'Hazırlık', avgPrice: '300 ₺' },
        { title: 'Muffin Kalıbı (12\'li)', category: 'Hazırlık', avgPrice: '250 ₺' },
        { title: 'Kelepçeli Kek Kalıbı', category: 'Hazırlık', avgPrice: '400 ₺' },
        { title: 'Baton Kek Kalıbı', category: 'Hazırlık', avgPrice: '300 ₺' },
        { title: 'Hamur Kesici/Kazıyıcı', category: 'Hazırlık', avgPrice: '75 ₺' },
    ],
    
    'Mutfak': [
        // Pişirme Grubu - Tencereler
        { title: 'Çelik Tencere Seti (Büyük)', category: 'Mutfak', avgPrice: '5.500 ₺' },
        { title: 'Granit Tencere Seti', category: 'Mutfak', avgPrice: '4.000 ₺' },
        { title: 'Döküm Tencere (24cm)', category: 'Mutfak', avgPrice: '2.500 ₺' },
        { title: 'Düdüklü Tencere', category: 'Mutfak', avgPrice: '4.000 ₺' },
        { title: 'Karnıyarık Tenceresi', category: 'Mutfak', avgPrice: '1.200 ₺' },
        { title: 'Sahan Seti (3\'lü)', category: 'Mutfak', avgPrice: '1.500 ₺' },
        { title: 'Sos Tenceresi', category: 'Mutfak', avgPrice: '400 ₺' },
        { title: 'Sütlük', category: 'Mutfak', avgPrice: '300 ₺' },
        { title: 'Kızartma Tenceresi (Sepetli)', category: 'Mutfak', avgPrice: '600 ₺' },
        
        // Tavalar
        { title: 'Tava Seti (20-24-28cm)', category: 'Mutfak', avgPrice: '2.000 ₺' },
        { title: 'Wok Tava', category: 'Mutfak', avgPrice: '800 ₺' },
        { title: 'Krep Tavası', category: 'Mutfak', avgPrice: '500 ₺' },
        { title: 'Grill (Izgara) Tava', category: 'Mutfak', avgPrice: '900 ₺' },
        { title: 'Balık Tavası (Çift Taraflı)', category: 'Mutfak', avgPrice: '700 ₺' },
        { title: 'Yumurta Tavası (Tekli)', category: 'Mutfak', avgPrice: '250 ₺' },
        
        // Fırın & Ocak Üstü
        { title: 'Çaydanlık (Aile Boyu)', category: 'Mutfak', avgPrice: '1.800 ₺' },
        { title: 'Çaydanlık (Küçük/Günlük)', category: 'Mutfak', avgPrice: '1.200 ₺' },
        { title: 'Cezve Takımı (Standlı)', category: 'Mutfak', avgPrice: '800 ₺' },
        { title: 'Borcam Seti (Dikdörtgen/Kare)', category: 'Mutfak', avgPrice: '600 ₺' },
        { title: 'Güveç Kapları (6\'lı)', category: 'Mutfak', avgPrice: '300 ₺' },
        { title: 'Fırın Tepsisi (Emaye)', category: 'Mutfak', avgPrice: '400 ₺' },
        { title: 'Pizza Tepsisi', category: 'Mutfak', avgPrice: '250 ₺' },
        
        // Yemek Takımları
        { title: 'Misafir Yemek Takımı (12 Kişilik)', category: 'Mutfak', avgPrice: '18.000 ₺' },
        { title: 'Günlük Yemek Takımı (6 Kişilik)', category: 'Mutfak', avgPrice: '4.000 ₺' },
        { title: 'Kahvaltı Takımı (6 Kişilik)', category: 'Mutfak', avgPrice: '3.500 ₺' },
        { title: 'Pasta Tabağı Seti (6\'lı)', category: 'Mutfak', avgPrice: '1.000 ₺' },
        { title: 'Servis Tabakları (Kayık)', category: 'Mutfak', avgPrice: '800 ₺' },
        { title: 'Çorba Kaseleri', category: 'Mutfak', avgPrice: '600 ₺' },
        
        // Çatal Kaşık Bıçak
        { title: 'Misafir Çatal Kaşık Bıçak Seti (sandıklı)', category: 'Mutfak', avgPrice: '8.000 ₺' },
        { title: 'Günlük Çatal Kaşık Bıçak Seti', category: 'Mutfak', avgPrice: '3.000 ₺' },
        { title: 'Tatlı Çatal Kaşık Seti', category: 'Mutfak', avgPrice: '1.500 ₺' },
        { title: 'Çay Kaşığı Seti (12\'li)', category: 'Mutfak', avgPrice: '400 ₺' },
        { title: 'Servis Seti (Kepçe, Kevgir, Spatula)', category: 'Mutfak', avgPrice: '1.200 ₺' },
        
        // İçecek Grubu
        { title: 'Su Takımı (Karaf + 12 Bardak)', category: 'Mutfak', avgPrice: '3.000 ₺' },
        { title: 'Günlük Su Bardağı (6\'lı)', category: 'Mutfak', avgPrice: '400 ₺' },
        { title: 'Meşrubat Bardağı (6\'lı)', category: 'Mutfak', avgPrice: '400 ₺' },
        { title: 'Çay Bardağı Takımı (12\'li)', category: 'Mutfak', avgPrice: '800 ₺' },
        { title: 'Kahve Fincan Takımı (6\'lı)', category: 'Mutfak', avgPrice: '1.200 ₺' },
        { title: 'Nescafe/Kupa Seti', category: 'Mutfak', avgPrice: '600 ₺' },
        { title: 'Ayaklı Kadeh Seti', category: 'Mutfak', avgPrice: '1.500 ₺' },
        { title: 'Kahve Yanı Su Bardağı', category: 'Mutfak', avgPrice: '300 ₺' },
        { title: 'Sürahi (Cam)', category: 'Mutfak', avgPrice: '250 ₺' },
        
        // Sunum & Masaüstü
        { title: 'Tuzluk & Biberlik Seti', category: 'Mutfak', avgPrice: '150 ₺' },
        { title: 'Yağdanlık & Sirkelik', category: 'Mutfak', avgPrice: '300 ₺' },
        { title: 'Peçetelik', category: 'Mutfak', avgPrice: '150 ₺' },
        { title: 'Amerikan Servis Seti (6\'lı)', category: 'Mutfak', avgPrice: '500 ₺' },
        { title: 'Runner & Masa Örtüsü', category: 'Mutfak', avgPrice: '750 ₺' },
        { title: 'Sunum Tahtası (Ahşap)', category: 'Mutfak', avgPrice: '400 ₺' },
        { title: 'Katlı Kurabiyelik', category: 'Mutfak', avgPrice: '500 ₺' },
        { title: 'Kapaklı Kek Fanusu', category: 'Mutfak', avgPrice: '600 ₺' },
        { title: 'Çerezlik Seti', category: 'Mutfak', avgPrice: '400 ₺' },
        { title: 'Nihale (Altlık)', category: 'Mutfak', avgPrice: '100 ₺' },
        { title: 'Tepsi Seti (Büyük/Orta/Küçük)', category: 'Mutfak', avgPrice: '600 ₺' },
        
        // Saklama & Düzen
        { title: 'Baharat Takımı (Standlı)', category: 'Mutfak', avgPrice: '800 ₺' },
        { title: 'Erzak Kavanozları (Set)', category: 'Mutfak', avgPrice: '1.000 ₺' },
        { title: 'Saklama Kabı Seti (Cam)', category: 'Mutfak', avgPrice: '750 ₺' },
        { title: 'Yağ Sıçratmaz', category: 'Mutfak', avgPrice: '100 ₺' },
        { title: 'Ekmek Kutusu', category: 'Mutfak', avgPrice: '500 ₺' },
        { title: 'Kaşıklık (Çekmece İçi)', category: 'Mutfak', avgPrice: '150 ₺' },
        { title: 'Bulaşıklık', category: 'Mutfak', avgPrice: '400 ₺' },
        
        // Tekstil
        { title: 'Mutfak Önlüğü', category: 'Mutfak', avgPrice: '150 ₺' },
        { title: 'Fırın Eldiveni & Tutacak', category: 'Mutfak', avgPrice: '150 ₺' },
        { title: 'Kurulama Bezi (3\'lü)', category: 'Mutfak', avgPrice: '150 ₺' },
        { title: 'El Havlusu (Mutfak)', category: 'Mutfak', avgPrice: '150 ₺' },
    ],

    'Salon': [
        // Mobilya
        { title: 'Koltuk Takımı (3+3+1+1)', category: 'Salon', avgPrice: '45.000 ₺' },
        { title: 'Köşe Koltuk Takımı', category: 'Salon', avgPrice: '35.000 ₺' },
        { title: 'Berjer (Tekli)', category: 'Salon', avgPrice: '8.000 ₺' },
        { title: 'TV Ünitesi', category: 'Salon', avgPrice: '7.500 ₺' },
        { title: 'Orta Sehpa', category: 'Salon', avgPrice: '3.500 ₺' },
        { title: 'Zigon Sehpa Seti (3\'lü)', category: 'Salon', avgPrice: '2.500 ₺' },
        { title: 'Yan Sehpa (C Sehpa)', category: 'Salon', avgPrice: '1.200 ₺' },
        { title: 'Yemek Masası', category: 'Salon', avgPrice: '12.000 ₺' },
        { title: 'Yemek Sandalyesi (6\'lı)', category: 'Salon', avgPrice: '12.000 ₺' },
        { title: 'Konsol', category: 'Salon', avgPrice: '10.000 ₺' },
        { title: 'Gümüşlük / Vitrin', category: 'Salon', avgPrice: '8.000 ₺' },
        { title: 'Kitaplık', category: 'Salon', avgPrice: '4.000 ₺' },
        
        // Aydınlatma
        { title: 'Avize (Ana Aydınlatma)', category: 'Salon', avgPrice: '2.500 ₺' },
        { title: 'Lambader (Köşe)', category: 'Salon', avgPrice: '2.000 ₺' },
        { title: 'Masa Lambası / Abajur', category: 'Salon', avgPrice: '1.000 ₺' },
        { title: 'Spot Aydınlatma', category: 'Salon', avgPrice: '1.500 ₺' },
        
        // Tekstil & Halı
        { title: 'Salon Halısı (6m2)', category: 'Salon', avgPrice: '5.000 ₺' },
        { title: 'Salon Halısı (4m2)', category: 'Salon', avgPrice: '3.500 ₺' },
        { title: 'Tül Perde', category: 'Salon', avgPrice: '4.000 ₺' },
        { title: 'Fon Perde (Çift Kanat)', category: 'Salon', avgPrice: '3.000 ₺' },
        { title: 'Kırlent / Dekoratif Yastık', category: 'Salon', avgPrice: '500 ₺' },
        { title: 'Koltuk Şalı', category: 'Salon', avgPrice: '400 ₺' },
        
        // Dekorasyon
        { title: 'Duvar Saati', category: 'Salon', avgPrice: '750 ₺' },
        { title: 'Dekoratif Ayna', category: 'Salon', avgPrice: '2.000 ₺' },
        { title: 'Tablo / Çerçeve Seti', category: 'Salon', avgPrice: '1.500 ₺' },
        { title: 'Vazo', category: 'Salon', avgPrice: '600 ₺' },
        { title: 'Yapay Çiçek / Bitki', category: 'Salon', avgPrice: '800 ₺' },
        { title: 'Şamdan / Mumluk', category: 'Salon', avgPrice: '500 ₺' },
        { title: 'Dekoratif Obje Seti', category: 'Salon', avgPrice: '1.000 ₺' },
        { title: 'Gazetelik / Dergilik', category: 'Salon', avgPrice: '400 ₺' },
    ],

    'Yatak Odası': [
        // Mobilya
        { title: 'Yatak Bazası (Çift Kişilik)', category: 'Yatak Odası', avgPrice: '8.000 ₺' },
        { title: 'Yatak Başlığı', category: 'Yatak Odası', avgPrice: '4.000 ₺' },
        { title: 'Yatak (Ortopedik/Çift)', category: 'Yatak Odası', avgPrice: '15.000 ₺' },
        { title: 'Gardırop (Sürgülü/Kapaklı)', category: 'Yatak Odası', avgPrice: '25.000 ₺' },
        { title: 'Şifonyer', category: 'Yatak Odası', avgPrice: '6.000 ₺' },
        { title: 'Komodin (2 Adet)', category: 'Yatak Odası', avgPrice: '4.000 ₺' },
        { title: 'Makyaj Masası & Ayna', category: 'Yatak Odası', avgPrice: '5.000 ₺' },
        { title: 'Puf / Bench', category: 'Yatak Odası', avgPrice: '2.000 ₺' },
        { title: 'Boy Aynası', category: 'Yatak Odası', avgPrice: '2.500 ₺' },
        
        // Tekstil (Nevresim & Yatak)
        { title: 'Nevresim Takımı (Saten - Çift)', category: 'Yatak Odası', avgPrice: '2.500 ₺' },
        { title: 'Nevresim Takımı (Pamuk - Çift)', category: 'Yatak Odası', avgPrice: '1.500 ₺' },
        { title: 'Nevresim Takımı (Günlük - Çift)', category: 'Yatak Odası', avgPrice: '1.000 ₺' },
        { title: 'Nevresim Takımı (Tek Kişilik)', category: 'Yatak Odası', avgPrice: '900 ₺' },
        { title: 'Pike Takımı (Çift Kişilik)', category: 'Yatak Odası', avgPrice: '1.200 ₺' },
        { title: 'Pike Takımı (Tek Kişilik)', category: 'Yatak Odası', avgPrice: '800 ₺' },
        { title: 'Yatak Örtüsü (Çeyizlik)', category: 'Yatak Odası', avgPrice: '4.000 ₺' },
        { title: 'Yatak Örtüsü (Günlük)', category: 'Yatak Odası', avgPrice: '1.500 ₺' },
        { title: 'Battaniye (Emboss)', category: 'Yatak Odası', avgPrice: '1.000 ₺' },
        { title: 'Battaniye (Örgü/TV)', category: 'Yatak Odası', avgPrice: '600 ₺' },
        { title: 'Yorgan (Çift Kişilik - Yün/Elyaf)', category: 'Yatak Odası', avgPrice: '2.000 ₺' },
        { title: 'Yorgan (Tek Kişilik)', category: 'Yatak Odası', avgPrice: '1.200 ₺' },
        { title: 'Yastık (Silikon - 4 Adet)', category: 'Yatak Odası', avgPrice: '800 ₺' },
        { title: 'Yastık (Visco/Ortopedik)', category: 'Yatak Odası', avgPrice: '1.000 ₺' },
        { title: 'Alez (Sıvı Geçirmez - Çift)', category: 'Yatak Odası', avgPrice: '500 ₺' },
        { title: 'Çarşaf Seti (Lastikli)', category: 'Yatak Odası', avgPrice: '600 ₺' },
        
        // Diğer
        { title: 'Yatak Odası Halısı (3 Parça)', category: 'Yatak Odası', avgPrice: '2.500 ₺' },
        { title: 'Perde Takımı (Yatak Odası)', category: 'Yatak Odası', avgPrice: '3.000 ₺' },
        { title: 'Abajur (2 Adet)', category: 'Yatak Odası', avgPrice: '1.500 ₺' },
        { title: 'Kıyafet Askıları (Çoklu)', category: 'Yatak Odası', avgPrice: '300 ₺' },
        { title: 'Hurç Seti (Vakumlu/Bez)', category: 'Yatak Odası', avgPrice: '500 ₺' },
    ],

    'Elektronik': [
        // Küçük Ev Aletleri (Mutfak)
        { title: 'Çay Makinesi', category: 'Elektronik', avgPrice: '2.500 ₺' },
        { title: 'Türk Kahvesi Makinesi', category: 'Elektronik', avgPrice: '2.000 ₺' },
        { title: 'Filtre Kahve Makinesi', category: 'Elektronik', avgPrice: '3.000 ₺' },
        { title: 'Blender Seti (Multi)', category: 'Elektronik', avgPrice: '2.500 ₺' },
        { title: 'Tost Makinesi', category: 'Elektronik', avgPrice: '2.500 ₺' },
        { title: 'Kettle (Su Isıtıcı)', category: 'Elektronik', avgPrice: '1.000 ₺' },
        { title: 'Airfryer (Sıcak Hava Fritözü)', category: 'Elektronik', avgPrice: '5.000 ₺' },
        { title: 'Mutfak Şefi (Hamur Yoğurma)', category: 'Elektronik', avgPrice: '8.000 ₺' },
        { title: 'Mikser (El Tipi)', category: 'Elektronik', avgPrice: '1.200 ₺' },
        { title: 'Ekmek Kızartma Makinesi', category: 'Elektronik', avgPrice: '1.800 ₺' },
        { title: 'Smoothie Blender (Kişisel)', category: 'Elektronik', avgPrice: '1.500 ₺' },
        { title: 'Katı Meyve Sıkacağı', category: 'Elektronik', avgPrice: '3.000 ₺' },
        { title: 'Kıyma Makinesi', category: 'Elektronik', avgPrice: '4.000 ₺' },
        { title: 'Tartı (Mutfak)', category: 'Elektronik', avgPrice: '400 ₺' },
        
        // Ev Temizliği & Bakım
        { title: 'Robot Süpürge', category: 'Elektronik', avgPrice: '15.000 ₺' },
        { title: 'Dikey Şarjlı Süpürge', category: 'Elektronik', avgPrice: '10.000 ₺' },
        { title: 'Elektrikli Süpürge (Toz Torbasız)', category: 'Elektronik', avgPrice: '6.000 ₺' },
        { title: 'Ütü (Buhar Kazanlı)', category: 'Elektronik', avgPrice: '5.000 ₺' },
        { title: 'Ütü (Buharlı Standart)', category: 'Elektronik', avgPrice: '2.000 ₺' },
        { title: 'Saç Kurutma Makinesi', category: 'Elektronik', avgPrice: '1.500 ₺' },
        { title: 'Saç Düzleştirici', category: 'Elektronik', avgPrice: '1.200 ₺' },
        { title: 'Saç Maşası', category: 'Elektronik', avgPrice: '1.000 ₺' },
        { title: 'Epilatör / Tıraş Makinesi', category: 'Elektronik', avgPrice: '1.500 ₺' },
        { title: 'Baskül (Tartı)', category: 'Elektronik', avgPrice: '500 ₺' },
        
        // Beyaz Eşya & Eğlence (Opsiyonel)
        { title: 'Televizyon (Smart TV)', category: 'Elektronik', avgPrice: '20.000 ₺' },
        { title: 'Bulaşık Makinesi', category: 'Elektronik', avgPrice: '18.000 ₺' },
        { title: 'Çamaşır Makinesi', category: 'Elektronik', avgPrice: '20.000 ₺' },
        { title: 'Buzdolabı', category: 'Elektronik', avgPrice: '30.000 ₺' },
        { title: 'Kurutma Makinesi', category: 'Elektronik', avgPrice: '15.000 ₺' },
        { title: 'Derin Dondurucu', category: 'Elektronik', avgPrice: '8.000 ₺' },
    ],

    'Banyo': [
        // Tekstil
        { title: 'Bornoz Takımı (Aile Seti)', category: 'Banyo', avgPrice: '3.500 ₺' },
        { title: 'Bornoz (Tekli)', category: 'Banyo', avgPrice: '1.500 ₺' },
        { title: 'Banyo Havlusu (Vücut)', category: 'Banyo', avgPrice: '400 ₺' },
        { title: 'El & Yüz Havlusu Seti', category: 'Banyo', avgPrice: '500 ₺' },
        { title: 'Baş Havlusu', category: 'Banyo', avgPrice: '200 ₺' },
        { title: 'Ayak Havlusu', category: 'Banyo', avgPrice: '200 ₺' },
        { title: 'Misafir Havlusu Seti', category: 'Banyo', avgPrice: '300 ₺' },
        { title: 'Klozet Takımı (Paspas)', category: 'Banyo', avgPrice: '600 ₺' },
        { title: 'Banyo Halısı', category: 'Banyo', avgPrice: '500 ₺' },
        
        // Aksesuar & Düzen
        { title: 'Banyo Seti (Sabunluk, Fırçalık 5\'li)', category: 'Banyo', avgPrice: '750 ₺' },
        { title: 'Çöp Kovası (Banyo)', category: 'Banyo', avgPrice: '300 ₺' },
        { title: 'Tuvalet Fırçası', category: 'Banyo', avgPrice: '200 ₺' },
        { title: 'Kirli Çamaşır Sepeti', category: 'Banyo', avgPrice: '500 ₺' },
        { title: 'Temiz Çamaşır Sepeti', category: 'Banyo', avgPrice: '300 ₺' },
        { title: 'Deterjan Kutusu', category: 'Banyo', avgPrice: '150 ₺' },
        { title: 'Mandal Sepeti', category: 'Banyo', avgPrice: '50 ₺' },
        { title: 'Duş Rafı / Köşelik', category: 'Banyo', avgPrice: '250 ₺' },
        { title: 'Kaydırmaz Banyo Matı', category: 'Banyo', avgPrice: '150 ₺' },
        { title: 'Lif / Kese Seti', category: 'Banyo', avgPrice: '100 ₺' },
        { title: 'Duş Perdesi (Gerekirse)', category: 'Banyo', avgPrice: '200 ₺' },
        { title: 'Havlu Askılığı (Ayaklı/Duvar)', category: 'Banyo', avgPrice: '400 ₺' },
    ],

    'Diğer': [
        // Ev Gereçleri & Temizlik
        { title: 'Ütü Masası', category: 'Diğer', avgPrice: '1.500 ₺' },
        { title: 'Çamaşır Kurutmalık', category: 'Diğer', avgPrice: '1.000 ₺' },
        { title: 'Vileda / Mop Temizlik Seti', category: 'Diğer', avgPrice: '600 ₺' },
        { title: 'Temizlik Kovası', category: 'Diğer', avgPrice: '150 ₺' },
        { title: 'Çöp Kovası (Mutfak - Pedallı)', category: 'Diğer', avgPrice: '400 ₺' },
        { title: 'Süpürge & Faraş Takımı', category: 'Diğer', avgPrice: '150 ₺' },
        { title: 'Cam Silme Aparatı', category: 'Diğer', avgPrice: '200 ₺' },
        { title: 'Leğen Seti', category: 'Diğer', avgPrice: '150 ₺' },
        { title: 'Mandal Seti', category: 'Diğer', avgPrice: '75 ₺' },
        
        // Düzen & Hırdavat
        { title: 'Dikiş Seti (Kutu)', category: 'Diğer', avgPrice: '200 ₺' },
        { title: 'Takım Çantası (Tornavida Seti)', category: 'Diğer', avgPrice: '500 ₺' },
        { title: 'İlk Yardım Çantası', category: 'Diğer', avgPrice: '300 ₺' },
        { title: 'Üçlü Priz / Uzatma Kablosu', category: 'Diğer', avgPrice: '200 ₺' },
        { title: 'Pil Seti', category: 'Diğer', avgPrice: '150 ₺' },
        { title: 'El Feneri / Işıldak', category: 'Diğer', avgPrice: '200 ₺' },
        { title: 'Ayakkabılık', category: 'Diğer', avgPrice: '1.500 ₺' },
        { title: 'Portmanto / Askılık', category: 'Diğer', avgPrice: '3.000 ₺' },
        { title: 'Kapı Önü Paspası', category: 'Diğer', avgPrice: '200 ₺' },
        { title: 'Şemsiyelik', category: 'Diğer', avgPrice: '300 ₺' },
        { title: 'Valiz Seti (3\'lü)', category: 'Diğer', avgPrice: '4.000 ₺' },
        { title: 'Seccade / Tesbih', category: 'Diğer', avgPrice: '300 ₺' },
        { title: 'Terlik (Misafir için)', category: 'Diğer', avgPrice: '400 ₺' },
    ]
}

// 1. VERİ ÇEKME & CACHE MANTIĞI
const initData = async (forceApi = false) => {
    loading.value = true

    // A) Kullanıcı Kontrolü
    if (!user.value) {
        try { await me() } catch (e) { /* Login gerekir */ }
    }
    if (!user.value) { loading.value = false; return; }

    // B) LocalStorage Kontrolü (forceApi false ise ve cache varsa oradan oku)
    if (!forceApi) {
        const cachedData = localStorage.getItem(CACHE_KEY)
        if (cachedData) {
            try {
                myProducts.value = JSON.parse(cachedData)
                console.log('📦 Veriler LocalStorage\'dan yüklendi.')
                loading.value = false
                return // API isteği yapmadan çık
            } catch (e) {
                console.error('Cache parse hatası, API\'ye gidiliyor...')
            }
        }
    }

    // C) API İsteği (Cache yoksa veya zorla yenileme isteniyorsa)
    try {
        const res: any = await request('/api/products', {
            method: 'GET',
            query: {
                'pagination[pageSize]': 1000, // Tüm ürünleri çek
                'fields[0]': 'title',         // Sadece başlıklar (Performans)
                'filters[user][id][$eq]': user.value.id
            }
        })
        
        myProducts.value = res.data || []
        
        // D) Veriyi Cache'le
        localStorage.setItem(CACHE_KEY, JSON.stringify(myProducts.value))
        console.log('🌍 Veriler API\'den çekildi ve Cache\'lendi.')

    } catch (e) {
        console.error('Ürünler çekilemedi', e)
    } finally {
        loading.value = false
    }
}

// Sayfa açıldığında başlat
onMounted(() => initData(false))

// Kullanıcı elle güncellemek isterse
const forceRefresh = () => {
    localStorage.removeItem(CACHE_KEY)
    initData(true)
}

// 2. AKILLI KARŞILAŞTIRMA (Türkçe Uyumlu)
const getStatus = (suggestionTitle: string) => {
    const searchKey = suggestionTitle.toLocaleLowerCase('tr-TR').trim()
    
    const match = myProducts.value.find(p => {
        if(!p.title) return false
        const myTitle = p.title.toLocaleLowerCase('tr-TR').trim()
        // Fuzzy Match: "Blender" -> "Arzum Blender Seti" (Eşleşir)
        return myTitle.includes(searchKey) || searchKey.includes(myTitle)
    })

    if (match) {
        return { exists: true, matchName: match.title }
    }
    return { exists: false, matchName: '' }
}

// 3. EKLEME MODALI (Listem.vue ile Aynı Gelişmiş Modal)
const openAddModal = async (suggestion: any) => {
  const categories = ['Hazırlık','Mutfak', 'Salon', 'Yatak Odası', 'Elektronik', 'Banyo', 'Diğer']

  const { value: values } = await Swal.fire({
    title: 'Listene Ekle',
    html: `
      <div class="text-left space-y-3 p-1">
        <label class="text-xs text-gray-400 font-bold uppercase">Ürün Adı</label>
        <input id="sw-title" class="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50" value="${suggestion.title}">
        
        <label class="text-xs text-gray-400 font-bold uppercase">Kategori</label>
        <select id="sw-category" class="w-full px-3 py-2 border rounded-lg text-sm bg-white">
           ${categories.map(c => `<option value="${c}" ${c === suggestion.category ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
        
        <div class="border border-dashed border-gray-300 rounded-lg p-3 bg-gray-50 text-center relative mt-2">
            <input type="file" id="sw-file" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
            <div class="text-gray-500 text-sm" id="sw-file-label">
                <i class="fas fa-cloud-upload-alt text-2xl mb-1 text-rose-400"></i><br>
                Bilgisayardan Fotoğraf Seç
            </div>
        </div>

        <div class="text-center text-[10px] text-gray-400 font-bold my-1">- VEYA -</div>

        <input id="sw-image" class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Resim Linki (İnternetten)">
        
        <div class="grid grid-cols-2 gap-2 mt-2">
           <div>
             <label class="text-xs text-gray-400 font-bold uppercase">Fiyat (₺)</label>
             <input id="sw-price" type="number" class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="0">
           </div>
           <div>
             <label class="text-xs text-gray-400 font-bold uppercase">Link</label>
             <input id="sw-link" class="w-full px-3 py-2 border rounded-lg text-sm" placeholder="https://...">
           </div>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Kaydet',
    confirmButtonColor: '#e11d48',
    cancelButtonText: 'Vazgeç',
    didOpen: () => {
        const fileInput = document.getElementById('sw-file') as HTMLInputElement
        const urlInput = document.getElementById('sw-image') as HTMLInputElement
        const label = document.getElementById('sw-file-label')

        if(fileInput && urlInput && label) {
            fileInput.addEventListener('change', (e: any) => {
                if (e.target.files.length > 0) {
                    label.innerHTML = `<i class="fas fa-check text-green-500"></i> ${e.target.files[0].name}`
                    label.classList.add('text-green-600', 'font-bold')
                    urlInput.value = '' 
                }
            })
            urlInput.addEventListener('input', () => {
                if(urlInput.value.length > 0) {
                    fileInput.value = '' 
                    label.innerHTML = `<i class="fas fa-cloud-upload-alt text-2xl mb-1 text-rose-400"></i><br>Bilgisayardan Fotoğraf Seç`
                    label.classList.remove('text-green-600', 'font-bold')
                }
            })
        }
    },
    preConfirm: () => {
      const title = (document.getElementById('sw-title') as HTMLInputElement)?.value?.trim()
      const category = (document.getElementById('sw-category') as HTMLSelectElement)?.value
      const imageUrl = (document.getElementById('sw-image') as HTMLInputElement)?.value?.trim()
      const fileInput = (document.getElementById('sw-file') as HTMLInputElement)
      const priceRaw = (document.getElementById('sw-price') as HTMLInputElement)?.value
      const link = (document.getElementById('sw-link') as HTMLInputElement)?.value?.trim()

      if (!title) { Swal.showValidationMessage('Ürün adı giriniz'); return }
      const file = fileInput.files?.length ? fileInput.files[0] : null
      return { title, category, imageUrl, file, priceRaw, link }
    }
  })

  if (!values) return

  Swal.fire({ title: 'Listene Ekleniyor...', didOpen: () => Swal.showLoading() })

  try {
    let uploadedImageId = null

    // Resim Upload
    if (values.file) {
        if (!jwtCookie.value) throw new Error("Oturum hatası")
        const formData = new FormData()
        formData.append('files', values.file)
        const uploadRes: any = await $fetch(`${config.public.apiBase}/api/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${jwtCookie.value}` },
            body: formData
        })
        if (uploadRes && uploadRes[0]) uploadedImageId = uploadRes[0].id
    }

    // Ürün Ekleme İsteği
    const price = values.priceRaw ? Number(values.priceRaw) : 0
    await request('/api/products', {
      method: 'POST',
      body: {
        data: {
          title: values.title,
          category: values.category,
          image: uploadedImageId,     
          imageUrl: values.imageUrl,
          price: price,
          link: values.link || null,  
          is_purchased: false,
          is_template: false,
        },
      },
    })

    // --- KRİTİK: ANLIK UPDATE MANTIĞI ---
    // API'den tekrar çekmek yerine, Cache'i ve State'i manuel güncelliyoruz.
    // Bu sayede "Listende Var" yazısı ışık hızında çıkar.
    const newItem = { title: values.title }
    myProducts.value.push(newItem) // State güncelle
    localStorage.setItem(CACHE_KEY, JSON.stringify(myProducts.value)) // Cache güncelle
    
    Swal.mixin({ toast: true, position: 'bottom-end', showConfirmButton: false, timer: 2000 })
        .fire({ icon: 'success', title: 'Listenize eklendi! 🎉' })

  } catch (e: any) {
    console.error(e)
    Swal.fire('Hata', 'Eklenirken bir sorun oluştu.', 'error')
  }
}
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-bounce-short {
    animation: bounceShort 0.5s;
}
@keyframes bounceShort {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
}
</style>