<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { connect_storage_channel, auth_token } from './file_backend.js'
import { connect_organisation_channel } from './organisation_backend.js'

onMounted(() => {
  if (auth_token) {
    connect_storage_channel()
    connect_organisation_channel()
  }
})
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
