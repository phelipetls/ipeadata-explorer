import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'

const container = document.getElementById('root')!
const root = createRoot(container)

const queryClient = new QueryClient()

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <App />
      </NuqsAdapter>
    </QueryClientProvider>
  </React.StrictMode>,
)
