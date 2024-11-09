<script setup>
import { RouterLink, useRouter } from 'vue-router'
import ActionBarInclude from "../components/ActionBarInclude.vue"

</script>

<template>
  <ActionBarInclude>
  <main>
    <ul class="signup_form py-8 text-center items-center text-red-800 grid grid-cols-4 grid-rows-2 px-28" @submit="create_user_submit">
      <div class="col-span-4 mb-20">
        <h2 class="text-2xl text-red-800 font-nasalization font-bold my-2">Tools Directory</h2>
        <hr/>
      </div>

      <div>
        <h2 class="text-2xl text-red-800 font-nasalization font-bold col-span-3">Watermark</h2>
        <a target="_blank" href="watermark" class="my-16"><li>
          🪣 Image Watermakring
        </li></a>
      </div>
      <div>
        <h2 class="text-2xl text-red-800 font-nasalization font-bold col-span-3">Redactor</h2>
        <a target="_blank" href="editor" class="my-16"><li>
          🙈 PDF Redaction
        </li></a>
        <a target="_blank" href="image" class="my-16"><li>
          🙈 Image Redaction
        </li></a>
      </div>
      <div>
        <h2 class="text-2xl text-red-800 font-nasalization font-bold col-span-3">Scanner</h2>
        <a target="_blank" href="classification" class="my-16"><li>
          🗃️ Data Classification
        </li></a>
      </div>
      <div>
        <h2 class="text-2xl text-red-800 font-nasalization font-bold col-span-3">Dashboard</h2>
        <a target="_blank" href="admin" class="my-16"><li>
          🔍 Vulnerablity Audit
        </li></a>
      </div>
    </ul>
  </main>
</ActionBarInclude>
</template>

<style scoped>
.active-form-type {
  @apply bg-blue-600 text-white shadow-lg w-3/5;
}
</style>
