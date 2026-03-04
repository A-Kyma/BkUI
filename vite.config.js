import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'BkUI',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.esm.js' : 'index.cjs.js')
    },
    rollupOptions: {
      external: ['vue', 'quasar', 'vue-meteor-tracker'],
      output: {
        globals: {
          vue: 'Vue',
          quasar: 'Quasar',
          'vue-meteor-tracker': 'VueMeteorTracker'
        }
      }
    }
  }
})
