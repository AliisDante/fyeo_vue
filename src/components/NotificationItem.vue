<script setup>
import { ref, onMounted } from 'vue'
import IconXMark from './icons/IconXMark.vue'
import { delete_message } from '../messages.js'

defineProps(["message", "type", "notification_index"])

let notification_elem = ref(null);
let transparent_class = ref("transparent");

function close_handler() {
  transparent_class.value = "transparent";
  setTimeout(() => delete_message(notification_elem.value.getAttribute("data-notification_index")), 400);
}

onMounted(() => transparent_class.value = "");
</script>

<template>
  <div class="notification_item w-1/3 py-2 px-4 shadow-sm text-white flex justify-between items-center rounded-sm transition" ref="notification_elem" :class="[type, transparent_class]" :data-notification_index="notification_index">
    <span>{{ message }}</span>
    <button @click="close_handler">
      <IconXMark />
    </button>
  </div>
</template>

<style scoped>
.notification_item.error {
  @apply bg-red-800;
}

.notification_item.success {
  @apply bg-green-600;
}

.notification_item.transparent {
  @apply opacity-0;
}
</style>
