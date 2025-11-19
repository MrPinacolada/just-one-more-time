// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: "/",
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"],
  typescript: {
    strict: true,
  },
  
  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: false,
      failOnError: false
    }
  },
  
  ssr: false,
  components: true,
});
