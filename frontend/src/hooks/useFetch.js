import { useState, useEffect, useCallback } from 'react'
import client from '../api/client'

// Tiny data-fetching hook used across pages. Returns { data, loading, error,
// reload }. Centralises the loading/error/empty pattern so every page can render
// consistent states. `fallback` is returned as data when the request fails,
// letting pages degrade gracefully when the backend is unreachable.
export default function useFetch(url, { fallback = null, skip = false } = {}) {
  const [data, setData] = useState(fallback)
  const [loading, setLoading] = useState(!skip)
  const [error, setError] = useState(null)

  const run = useCallback(async () => {
    if (skip || !url) return
    setLoading(true)
    setError(null)
    try {
      const res = await client.get(url)
      setData(res.data)
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Something went wrong.')
      if (fallback !== null) setData(fallback)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, skip])

  useEffect(() => {
    run()
  }, [run])

  return { data, loading, error, reload: run, setData }
}
