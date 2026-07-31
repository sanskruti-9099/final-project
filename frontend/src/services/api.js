import axios from 'axios'

/**
 * Pre-configured Axios instance pointing at the backend API.
 *
 * In development Vite proxies /api to https://final-project-pkau.onrender.com,
 * so we use a relative baseURL.
 */
const api = axios.create({
  baseURL: '/api/v1',
  timeout: 120000, // 120 seconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// ── Request interceptor ──────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Attach auth token when available (placeholder for future auth)
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor ─────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response

      if (status === 401) {
        console.warn('[api] Unauthorized — clearing token.')
        localStorage.removeItem('token')
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
            window.location.href = '/login'
        }
      }

      if (status === 500) {
        console.error('[api] Internal server error', error.response.data)
      }
    } else if (error.request) {
      console.error('[api] No response received', error.request)
    } else {
      console.error('[api] Request setup error', error.message)
    }

    return Promise.reject(error)
  },
)

export default api
