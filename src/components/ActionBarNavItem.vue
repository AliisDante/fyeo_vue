<script setup>
defineProps(["description", "header_class", "active_nav", "nav_name", "link_to"])

import { RouterLink } from 'vue-router';
</script>

<template>
  <RouterLink :to="link_to" class="w-full">
    <button class="nav-item flex items-center w-full h-7 border border-white rounded-sm py-5 px-5 shadow-sm hover:shadow-md hover:bg-white hover:text-red-600" :class="[header_class]" :active_nav="active_nav == nav_name ? true : null">
      <slot />
      <span class="nav-description ml-2" :class="header_class">{{ description }}</span>
    </button>
  </RouterLink>
</template>

<style scoped>
.nav-description.header-closed {
  @apply hidden;
}

.nav-item.header-closed {
  @apply w-auto;
}

[active_nav] {
  @apply bg-white text-red-600;
}
</style>
