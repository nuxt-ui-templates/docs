<script setup lang="ts">
// Markdown tags (`::page-hero`, `:::button`) resolve from the components passed to the
// renderer below: Nuxt Content only bundles project components, so Nuxt UI's are imported here.
import Button from '@nuxt/ui/components/Button.vue'
import PageCTA from '@nuxt/ui/components/PageCTA.vue'
import PageFeature from '@nuxt/ui/components/PageFeature.vue'
import PageHero from '@nuxt/ui/components/PageHero.vue'
import PageSection from '@nuxt/ui/components/PageSection.vue'
import { ProseA } from '@nuxt/ui/components/prose'

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
</script>

<template>
  <ContentRenderer
    v-if="page"
    :value="page"
    :components="{ ProseA, PageHero, PageSection, PageFeature, PageCTA, Button }"
  />
</template>
