<script setup>
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

import { logout } from '../file_backend.js'
import { add_message } from '../messages.js'

let router = useRouter();

onMounted(() => {
  logout()
  add_message('success', 'Logout successful')
  router.push('/login')
})
</script>

<template>
</template>
