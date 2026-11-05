<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'
import { withoutTrailingSlash } from 'ufo'

definePageMeta({
  layout: 'docs'
})

const route = useRoute()
const { toc } = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const routePath = computed(() => withoutTrailingSlash(route.path))

const { data: page } = await useAsyncData(routePath.value, () => content.get(routePath.value))
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

// v4 has no native prev/next API, so this stays on the v3 compatibility layer.
// Its empty slot is typed `null` where v3's type hid it; `UContentSurround` renders
// an empty column for it, hence the cast in the template below.
const { data: surround } = await useAsyncData(`${routePath.value}-surround`, () => {
  return queryCollectionItemSurroundings('content', routePath.value, {
    fields: ['description']
  })
})

const title = page.value.data.title
const description = page.value.data.description

// v4 types frontmatter from the documents themselves, so a field no page uses yet
// (`links`, the header action buttons) is not part of `page.data`'s type.
interface PageLink {
  label: string
  icon?: string
  to: string
  target?: string
}

const pageLinks = computed<PageLink[]>(() => (page.value?.data as { links?: PageLink[] }).links ?? [])

interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

// The client `content` type exposes `meta` as `Record<string, unknown>`, so the table of
// contents the toc plugin attaches needs its shape spelled out.
const tocLinks = computed<TocLink[]>(() => (page.value?.meta.toc as { links?: TocLink[] } | undefined)?.links ?? [])

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

const headline = computed(() => findPageHeadline(navigation?.value, page.value?.path))

defineOgImage('Docs', { title, description, headline: headline.value })

const links = computed(() => {
  const links = []
  if (toc?.bottom?.edit) {
    links.push({
      icon: 'i-lucide-external-link',
      label: 'Edit this page',
      to: `${toc.bottom.edit}/${page?.value?.meta.stem}${page?.value?.meta.extension}`,
      target: '_blank'
    })
  }

  return [...links, ...(toc?.bottom?.links || [])].filter(Boolean)
})
</script>

<template>
  <UPage v-if="page">
    <UPageHeader
      :title="page.data.title"
      :description="page.data.description"
      :headline="headline"
    >
      <template #links>
        <UButton
          v-for="(link, index) in pageLinks"
          :key="index"
          v-bind="link"
        />

        <PageHeaderLinks />
      </template>
    </UPageHeader>

    <UPageBody>
      <ContentRenderer
        v-if="page"
        :value="page"
      />

      <USeparator v-if="surround?.length" />

      <UContentSurround :surround="surround as ContentNavigationItem[]" />
    </UPageBody>

    <template
      v-if="tocLinks.length"
      #right
    >
      <UContentToc
        :title="toc?.title"
        :links="tocLinks"
      >
        <template
          v-if="toc?.bottom"
          #bottom
        >
          <div
            class="hidden lg:block space-y-6"
            :class="{ 'mt-6!': tocLinks.length }"
          >
            <USeparator
              v-if="tocLinks.length"
              type="dashed"
            />

            <UPageLinks
              :title="toc.bottom.title"
              :links="links"
            />
          </div>
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>
