// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: "/just-one-more-time/",
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"],
  typescript: {
    strict: true,
  },

  target: "static",

  ssr: false,
  components: true,
});
