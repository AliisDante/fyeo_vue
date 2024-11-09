<script setup>
defineProps(["href", "folder_name"])
</script>

<template>
  <div class="flex items-center px-4 py-2 rounded-sm transition-shadow hover:shadow-md hover:font-semibold">
    <input type="checkbox" class="mr-4">
    <RouterLink class="grow text-red-800 cursor-pointer" :to="href">{{ folder_name }}</RouterLink>
  </div>
</template>
