import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base: env['VITE_APP_BASENAME'],
    server: {
      proxy: {
        '/api/odata4': {
          target: 'https://www.ipeadata.gov.br',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [
      react({
        babel: {
          plugins: ['babel-plugin-react-compiler'],
        },
      }),
      tailwindcss(),
    ],
  }
})
