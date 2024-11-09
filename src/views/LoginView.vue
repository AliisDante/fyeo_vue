<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import FocusHeader from "../components/FocusHeader.vue"
import IconUser from "../components/icons/IconUser.vue"
import IconKey from "../components/icons/IconKey.vue"
import { login } from "../file_backend.js"
import { add_message } from "../messages.js"

let router = useRouter();

function login_submit(e) {
  e.preventDefault();
  let form = e.target;
  let form_data = new FormData(form);
  login(form_data).then(({message, success}) => {
    if (success) {
      add_message("success", "Login successful");
      router.push("/files");
    }
    else {
      add_message("error", message);
    }
  })
}
</script>

<template>
  <FocusHeader />
  <main>
    <form class="login_form py-8 text-center" @submit="login_submit">
      <h2 class="text-2xl text-red-800 font-nasalization font-bold mb-1">Log In</h2>
      <div class="mb-4 text-center">
        <RouterLink class="italic w-fit text-base" to="/organisation_signup">Don't have an account? Sign up</RouterLink>
      </div>
      <label for="username" class="flex items-center justify-center mb-3">
        <div class="p-2 rounded-sm shadow-sm flex items-center justify-center bg-red-800 text-white z-10">
          <IconUser class="w-10 h-10"/>
        </div>
        <input class="pl-2 -ml-1 pr-3 py-1.5 border border-red-800 rounded-sm shadow-sm text-red-800 z-0 outline-none focus:border-2 active:border-2 placeholder:text-red-800" type="text" id="username" name="username" placeholder="Username" />
      </label>
      <label for="password" class="flex items-center justify-center mb-1">
        <input class="pr-2 -mr-1 pl-3 py-1.5 border border-red-800 rounded-sm shadow-sm text-red-800 z-0 outline-none focus:border-2 active:border-2 placeholder:text-red-800" type="password" id="password" name="password" placeholder="Password" />
        <div class="p-2.5 rounded-sm shadow-sm flex items-center justify-center bg-red-800 text-white z-10">
          <IconKey class="w-9 h-9"/>
        </div>
      </label>
      <div class="mb-5">
        <RouterLink class="italic text-sm" to="/forgot_password">Forgot password?</RouterLink>
      </div>
      <button type="submit" class="bg-red-800 text-white py-1.5 px-4 rounded-sm shadow-sm font-bold font-nasalization outline-none">Submit</button>
    </form>
  </main>
</template>

<style scoped>
.active-form-type {
  @apply bg-blue-600 text-white shadow-lg w-3/5;
}
</style>
