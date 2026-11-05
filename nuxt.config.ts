// `nuxt-agent-discovery` picks the pages of an `llms.sections` entry from a navigation
// subtree on v4, where v3's `contentCollection`/`contentFilters` were declared by
// `@nuxt/content`'s llms feature. Declared here until the module declares it itself.
declare module 'nuxt-llms' {
  interface LLMsSection {
    navigation?: string
  }
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-og-image',
    'nuxt-llms',
    'nuxt-agent-discovery',
    '@nuxtjs/mcp-toolkit'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  content: {
    // v4 serves the native `content.get()` / `content.navigation()` API, but has no equivalent
    // for two v3 features this template uses, so the v3 compatibility layer stays on for them:
    // search sections (`queryCollectionSearchSections`, `UContentSearch`) and prev/next links
    // (`queryCollectionItemSurroundings`).
    v3Composables: true,
    build: {
      markdown: {
        // v4 highlights only when configured, where v3's `@nuxtjs/mdc` did it by default, and
        // Nuxt UI hands its themes to `mdc.highlight`, which v4 doesn't read. Same themes, until
        // Nuxt UI configures the v4 option itself.
        highlight: {
          theme: {
            light: 'material-theme-lighter',
            default: 'material-theme',
            dark: 'material-theme-palenight'
          }
        },
        toc: {
          searchDepth: 1
        }
      }
    }
  },

  experimental: {
    asyncContext: true
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  llms: {
    domain: 'https://docs-template.nuxt.dev',
    title: 'Nuxt Docs Template',
    description: 'A template for building documentation with Nuxt UI and Nuxt Content.',
    full: {
      title: 'Nuxt Docs Template - Full Documentation',
      description: 'This is the full documentation for the Nuxt Docs Template.'
    },
    sections: [
      {
        title: 'Getting Started',
        // v4 has no collections, so sections select a navigation subtree instead of a collection.
        navigation: '/getting-started'
      },
      {
        title: 'Essentials',
        navigation: '/essentials'
      },
      {
        title: 'AI',
        navigation: '/ai'
      }
    ]
  },

  mcp: {
    name: 'Docs template'
  },

  ogImage: {
    zeroRuntime: true
  },

  prerender: {
    routes: [
      '/'
    ],
    crawlLinks: true
  }
})
