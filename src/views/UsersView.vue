<script setup>
import { ref } from 'vue'
import ActionBarInclude from "../components/ActionBarInclude.vue"
import UserRow from "../components/UserRow.vue";

import { get_users } from '../organisation_backend.js'

let users = ref([])

function load_users() {
  get_users((loaded_users) => users.value = loaded_users)
}

load_users()
</script>

<template>
  <ActionBarInclude>
  <main>
    <div class="pt-10 pl-10 pb-8 text-xl font-semibold bg-slate-50">
        Organisation Users
        <RouterLink class="right-2 mr-3 fixed 8 w-8 h-8 bg-black text-white rounded-sm text-center" to="/create_user">
            +
        </RouterLink>
    </div>
    <UserRow v-for="i in users" :username="i.username" :update_callback="load_users"></UserRow>
  </main>
</ActionBarInclude>
</template>

<style scoped>
.active-form-type {
  @apply bg-blue-600 text-white shadow-lg w-3/5;
}
</style>
