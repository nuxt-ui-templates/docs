<script setup lang="ts">
import Button from '@nuxt/ui/components/Button.vue'
import PageCTA from '@nuxt/ui/components/PageCTA.vue'
import PageFeature from '@nuxt/ui/components/PageFeature.vue'
import PageHero from '@nuxt/ui/components/PageHero.vue'
import PageSection from '@nuxt/ui/components/PageSection.vue'

const { data: page } = await useAsyncData('index', () => content.get('/'))
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = page.value.data.title
const description = page.value.data.description

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/docs-light.png'
})

// The landing page is written with Nuxt UI's page components. Nuxt Content only bundles
// project components for markdown tags, so they are attached here, without the `u-` prefix.
const components = {
  'page-hero': PageHero,
  'page-section': PageSection,
  'page-feature': PageFeature,
  'page-cta': PageCTA,
  'button': Button
}
</script>

<template>
  <ContentRenderer
    v-if="page"
    :value="page"
    :components="{ a: 'prose-a', ...components }"
  />
</template>
