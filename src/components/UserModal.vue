<template>
  <div class="backdrop w-full h-full fixed top-0 left-0 flex justify-center py-20">
    <div class="modal w-1/2 px-16 py-12 bg-white rounded-sm">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.backdrop {
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
