import { createError, defineEventHandler, getRouterParams } from 'nuxt/server'
import { withLeadingSlash } from 'ufo'
import { stringify } from 'minimark/stringify'
import { queryCollection } from '@nuxt/content/server'
import type { Collections } from '@nuxt/content'

export default defineEventHandler(async (event) => {
  const slug = getRouterParams(event, { decode: true })['slug.md']
  if (!slug?.endsWith('.md')) {
    throw createError({ status: 404, statusText: 'Page not found', fatal: true })
  }

  const path = withLeadingSlash(slug.replace('.md', ''))

  const page = await queryCollection(event, 'docs' as keyof Collections).path(path).first()
  if (!page) {
    throw createError({ status: 404, statusText: 'Page not found', fatal: true })
  }

  // Add title and description to the top of the page if missing
  if (page.body.value[0]?.[0] !== 'h1') {
    page.body.value.unshift(['blockquote', {}, page.description])
    page.body.value.unshift(['h1', {}, page.title])
  }

  event.res.headers.set('Content-Type', 'text/markdown; charset=utf-8')
  return stringify({ ...page.body, type: 'minimark' }, { format: 'markdown/html' })
})
