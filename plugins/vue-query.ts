import { VueQueryPlugin } from '@tanstack/vue-query'
import type { VueQueryPluginOptions } from '@tanstack/vue-query'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const options: VueQueryPluginOptions = {
    queryClientConfig: {
      defaultOptions: { queries: { staleTime: 5 * 60_000 } },
    },
  }

  nuxtApp.vueApp.use(VueQueryPlugin, options)
})
