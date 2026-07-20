import axios from 'axios'

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------
// baseURL is configurable through a Vite env var so the same build can point
// at different backends. In dev it defaults to "/api", which the Vite proxy
// (see vite.config.js) forwards to http://localhost:5000.
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

const client = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Storage key for the JWT. Centralised so AuthContext and the interceptor agree.
export const TOKEN_KEY = 'studybuddy_token'

// ---------------------------------------------------------------------------
// Casing bridge
// ---------------------------------------------------------------------------
// The frontend is uniformly camelCase; the Flask backend is uniformly
// snake_case. Rather than translate at every call site, we convert keys in one
// place: outgoing request bodies/params camelCase -> snake_case, and incoming
// response bodies snake_case -> camelCase.
export function snakeToCamel(key) {
  return key.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase())
}

export function camelToSnake(key) {
  return key.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase()
}

// Recurse through plain objects and arrays only, applying `fn` to each key.
// Dates, strings, numbers, etc. are returned untouched. Purely numeric keys
// (e.g. array-like maps) are left as-is.
function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    !(value instanceof Date) &&
    Object.prototype.toString.call(value) === '[object Object]'
  )
}

export function convertKeysDeep(obj, fn) {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysDeep(item, fn))
  }
  if (isPlainObject(obj)) {
    const out = {}
    for (const [key, value] of Object.entries(obj)) {
      const newKey = /^\d+$/.test(key) ? key : fn(key)
      out[newKey] = convertKeysDeep(value, fn)
    }
    return out
  }
  return obj
}

// Request interceptor: attach the JWT as a Bearer token when present, and
// deep-convert outgoing JSON body + query params camelCase -> snake_case.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (config.data && isPlainObject(config.data)) {
    config.data = convertKeysDeep(config.data, camelToSnake)
  } else if (Array.isArray(config.data)) {
    config.data = convertKeysDeep(config.data, camelToSnake)
  }
  if (config.params && isPlainObject(config.params)) {
    config.params = convertKeysDeep(config.params, camelToSnake)
  }
  return config
})

// Response interceptor: deep-convert incoming JSON body snake_case -> camelCase.
client.interceptors.response.use((response) => {
  if (response && response.data != null && typeof response.data === 'object') {
    response.data = convertKeysDeep(response.data, snakeToCamel)
  }
  return response
})

// Response interceptor: on a 401 we clear the stale token and bounce the user
// to the login screen. A full-page redirect keeps this logic out of every call
// site. We avoid redirecting if we are already on an auth page.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      const path = window.location.pathname
      if (!['/login', '/register'].includes(path)) {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  }
)

export default client
