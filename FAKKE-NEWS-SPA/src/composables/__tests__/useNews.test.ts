import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useNews } from '../useNews'

// Mock useApi
vi.mock('../useApi', () => ({
  useApi: () => ({
    get: vi.fn(),
    isLoading: { value: false },
    error: { value: null }
  })
}))

describe('useNews', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const n = useNews()
    
    expect(n.list.value).toEqual([])
    expect(n.isLoading.value).toBe(false)
    expect(n.error.value).toBe(null)
    expect(n.page.value).toBe(1)
  })

  it('should have filter functions', () => {
    const n = useNews()
    
    expect(typeof n.setCategoryFilter).toBe('function')
    expect(typeof n.setCountryFilter).toBe('function')
    expect(typeof n.setSearchFilter).toBe('function')
    expect(typeof n.clearFilters).toBe('function')
    expect(typeof n.resetFilters).toBe('function')
  })

  it('should have categories and countries arrays', () => {
    const n = useNews()
    
    expect(Array.isArray(n.categories.value)).toBe(true)
    expect(Array.isArray(n.countries.value)).toBe(true)
  })
})
