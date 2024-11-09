<script setup>
import NotificationItem from './NotificationItem.vue'

defineProps(["messages", "positioning"])
</script>

<template>
  <div class="fixed flex flex-col items-center w-full gap-y-4 z-50" :class="positioning">
    <NotificationItem v-for="(i, index) in messages" :message="i.message" :type="i.type" :notification_index="index" />
  </div>
</template>
