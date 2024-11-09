<script setup>
import ActionBarInclude from '../components/ActionBarInclude.vue'
import FileRow from '../components/FileRow.vue'

</script>

<template>
  <ActionBarInclude active_nav="drm">
    <FileLink />
    <FileRow />
    <FileRow />
  </ActionBarInclude>
</template>
