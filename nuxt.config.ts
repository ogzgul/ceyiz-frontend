// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:1337'
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

  compatibilityDate: '2024-12-05'
})