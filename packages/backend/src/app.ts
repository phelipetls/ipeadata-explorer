import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()

app.use(logger())
app.use(
  '/*',
  cors({
    origin: [
      'https://phelipetls.github.io',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ],
    allowMethods: ['GET', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    maxAge: 600,
    credentials: true,
  }),
)

const api = new Hono()

api.get('/*', async (c) => {
  const inputUrl = new URL(c.req.url)
  // Remove /v1 prefix from the path to forward to upstream
  const path = inputUrl.pathname.replace(/^\/v1/, '')
  const apiUrl = `http://ipeadata.gov.br/api/v1/${path}${inputUrl.search}`

  try {
    const response = await fetch(apiUrl)
    const data = await response.json()
    return c.json(data, 200)
  } catch (error) {
    console.error('Server error:', error)
    return c.json({ error: 'Failed to fetch from upstream' }, 500)
  }
})

app.route('/v1', api)

export { app }
