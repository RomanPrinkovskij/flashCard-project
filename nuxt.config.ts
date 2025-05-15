// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['@/assets/scss/main.scss'],
  modules: ['@nuxt/icon', '@nuxt/image', '@nuxt/ui'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: `
            @use "./assets/scss/_variables.scss" as *;

          `
        }
      }
    }
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'nuxt-icon'
    }
  }
});
