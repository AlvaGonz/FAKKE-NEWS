import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useApi } from '../useApi'

// Mock fetch
global.fetch = vi.fn()

describe('useApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const api = useApi()
    
    expect(api.isLoading.value).toBe(false)
    expect(api.error.value).toBe(null)
  })

  it('should make a successful GET request', async () => {
    const mockResponse = { id: 1, title: 'Test News' }
    const mockFetch = vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response)

    const api = useApi()

    const result = await api.get('/test')

    expect(mockFetch).toHaveBeenCalled()
    expect(api.isLoading.value).toBe(false)
    expect(api.error.value).toBe(null)
    expect(result).toEqual(mockResponse)
  })

  it('should handle API errors', async () => {
    const mockFetch = vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    } as Response)

    const api = useApi()

    try {
      await api.get('/test')
    } catch (error) {
      expect(typeof error).toBe('string')
    }
    expect(api.isLoading.value).toBe(false)
  })

  it('should handle network errors', async () => {
    const mockFetch = vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

    const api = useApi()

    try {
      await api.get('/test')
    } catch (error) {
      expect(typeof error).toBe('string')
    }
    expect(api.isLoading.value).toBe(false)
  })
})
