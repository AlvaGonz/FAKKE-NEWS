import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NewsCard from '../NewsCard.vue'

// Mock useAssets
vi.mock('@/composables/useAssets', () => ({
  resolveImageUrl: vi.fn((path) => `https://api.example.com${path}`)
}))

describe('NewsCard', () => {
  const mockNewsItem = {
    id: 1,
    title: 'Test News Title',
    content: 'This is a test news description that should be truncated if it is too long.',
    imagePath: '/uploads/test-image.jpg',
    publishedAt: '2024-01-15T10:30:00Z',
    category: { id: 1, name: 'Technology' },
    country: { id: 1, name: 'Spain' }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render news item correctly', () => {
    const wrapper = mount(NewsCard, {
      props: {
        item: mockNewsItem
      },
      global: {
        stubs: {
          'router-link': {
            template: '<a :to="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    })

    expect(wrapper.find('.news-card').exists()).toBe(true)
    expect(wrapper.find('.card-title').text()).toBe('Test News Title')
  })

  it('should display image when imagePath is provided', () => {
    const wrapper = mount(NewsCard, {
      props: {
        item: mockNewsItem
      },
      global: {
        stubs: {
          'router-link': {
            template: '<a :to="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    })

    const image = wrapper.find('.card-image img')
    expect(image.exists()).toBe(true)
    expect(image.attributes('src')).toBe('https://api.example.com/uploads/test-image.jpg')
    expect(image.attributes('alt')).toBe('Test News Title')
  })

  it('should display placeholder when no image is provided', () => {
    const newsItemWithoutImage = { ...mockNewsItem, imagePath: null }
    
    const wrapper = mount(NewsCard, {
      props: {
        item: newsItemWithoutImage
      },
      global: {
        stubs: {
          'router-link': {
            template: '<a :to="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    })

    expect(wrapper.find('.card-image img').exists()).toBe(false)
    expect(wrapper.find('.placeholder-image').exists()).toBe(true)
  })

  it('should render router-link for navigation', () => {
    const wrapper = mount(NewsCard, {
      props: {
        item: mockNewsItem
      },
      global: {
        stubs: {
          'router-link': {
            template: '<a :to="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    })

    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
  })
})
