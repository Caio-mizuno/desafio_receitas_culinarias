import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      setupFiles: ['./src/__tests__/setup.ts'],
      css: true,
      deps: { inline: ['vuetify', 'vue3-carousel'] },
    },
    coverage: {
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      provider: 'v8',
      include: [
        'src/components/**',
        'src/stores/**',
        'src/router/**',
        'src/plugins/**',
        'src/App.vue',
      ],
      exclude: [
        'src/views/**',
        'src/types/**',
        'src/main.ts',
        'src/stores/counter.ts',
      ],
    },
  }),
)
