<script setup>
let props = defineProps(['username', 'update_callback'])

  import { ref } from 'vue'
  import IconThreeDots from './icons/IconThreeDots.vue';

  import { delete_user } from '../organisation_backend.js'
  import { add_message } from '../messages.js'

  let hidden_class = ref("hidden");
  let username = props.username

  function menu_handler() {
    if (hidden_class.value == "") {
      hidden_class.value = "hidden"
    }
    else {
      hidden_class.value = ""
    }
  }

  function delete_handler() {
    delete_user(username, () => {
      add_message('success', 'Deleted user')
      props.update_callback()
    })
  }
</script>
<template>
  <div class="flex items-center px-4 py-2 ml-6 pl-6 mr-6 pr-6rounded-sm transition-shadow hover:shadow-md hover:font-semibold">
    <h3 class="grow">{{ username }}</h3>
    <div class="font-normal">
      <button @click="menu_handler" class="pl-4 pr-2 flex items-center"><IconThreeDots /></button>
      <div class="menu z-1 bg-white absolute right-4 grid grid-rows-2" :class="hidden_class">
        <a href="#" class="text-m p-2 hover:font-semibold hover:bg-slate-100">Manage</a>
        <a href="#" class="text-m p-2 hover:font-semibold hover:bg-slate-100" @click="delete_handler">Delete</a>
    </div>
  </div> 
  </div>
</template>
