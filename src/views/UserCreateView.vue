<script setup>
import { RouterLink, useRouter } from 'vue-router'
import ActionBarInclude from "../components/ActionBarInclude.vue"
import IconUser from "../components/icons/IconUser.vue"
import IconKey from "../components/icons/IconKey.vue"

import { create_user } from "../organisation_backend.js"
import { add_message } from "../messages.js"

let router = useRouter();

function create_user_submit(e) {
  e.preventDefault();
  let form = e.target;
  let form_data = new FormData(form);
  let params = Object.fromEntries(form_data.entries())

  create_user(params, () => {
    add_message("success", "User successfully created");
  },
  (error_message) => {
    add_message("error", error_message);
  })
}
</script>

<template>
  <ActionBarInclude>
  <main>
    <form class="signup_form py-8 text-center flex flex-col items-center text-red-800" @submit="create_user_submit">
      <h2 class="text-2xl text-red-800 font-bold mb-7">Create User</h2>
      <label for="username" class="flex items-center justify-center w-1/3 mb-5">
        <input class="px-2 py-1.5 w-full border border-red-800 rounded-sm shadow-sm text-red-800 z-0 outline-none focus:border-2 active:border-2 placeholder:text-red-800" type="text" id="username" name="username" placeholder="Username" />
      </label>
      <label for="password" class="flex items-center w-1/3 justify-center mb-5">
        <input class="px-2 py-1.5 w-full border border-red-800 rounded-sm shadow-sm text-red-800 z-0 outline-none focus:border-2 active:border-2 placeholder:text-red-800" type="password" id="password" name="password" placeholder="Password" />
      </label>
      <label for="confirm_password" class="flex items-center w-1/3 justify-center mb-5">
        <input class="px-2 py-1.5 w-full border border-red-800 rounded-sm shadow-sm text-red-800 z-0 outline-none focus:border-2 active:border-2 placeholder:text-red-800" type="password" id="confirm_password" name="confirm_password" placeholder="Confirm Password" />
      </label>
      <label for="is_admin" class="w-1/3 flex items-center justify-between mb-7">
        <span>Administrator:</span>
        <input type="checkbox" id="is_admin" name="is_admin" class="w-4 h-4">
      </label>
      <button type="submit" class="bg-red-800 text-white py-1.5 px-4 rounded-sm shadow-sm font-bold outline-none">Submit</button>
    </form>
  </main>
</ActionBarInclude>
</template>

<style scoped>
.active-form-type {
  @apply bg-blue-600 text-white shadow-lg w-3/5;
}
</style>
