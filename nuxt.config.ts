// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  runtimeConfig: {
    public: {
      apiBase: 'https://graceful-sharing-c629c8435b.strapiapp.com'
    }
  },

  app: {
    head: {
      title: 'Çeyiz Asistanı',
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css' }
      ]
    }
  },
routeRules: {
    // '/listem' sayfasında SSR (Sunucu Tarafı Render) kapatıldı.
    // Bu sayfa artık sadece tarayıcıda çalışır, Netlify sunucusunu asla yormaz/çökertmez.
    '/listem': { ssr: false },
    '/oneriler': { ssr: false } 
  },
  compatibilityDate: '2024-12-05'
})