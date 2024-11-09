<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';

import NotificationGroup from "./NotificationGroup.vue"
import { messages } from "../messages.js"

import { header_elem } from "../store/FocusHeaderStore.js"

let header_long_title = 'FOR YOUR EYES ONLY';
let header_short_title = 'FYEO';
let header_class = ref("");
let header_title = ref(header_long_title);
let header_space_style = ref("");

let pending_typewrites = [];
let last_text = '';

function set_header_space(height) {
  header_space_style.value = `height: ${height}px`;
}
function typewrite_text(elem_text, text) {
  if (last_text == text) {
    return;
  }
  for (const i of pending_typewrites) {
    clearTimeout(i);
  }
  pending_typewrites = [];
  elem_text.value = '';
  let iter_index = 0;
  for (const c of text) {
    let new_timeout = setTimeout(() => {
      elem_text.value += c
    }, iter_index * 30);
    pending_typewrites.push(new_timeout);
    iter_index++;
  }
  last_text = text;
}

function header_adjust_with_scroll() {
  let header_height = header_elem.value.offsetHeight;
  if (window.scrollY > header_height) {
    typewrite_text(header_title, header_short_title);
    header_class.value = "shrink-header";
  } else {
    typewrite_text(header_title, header_long_title);
    header_class.value = "";
  }
  // set_header_space(header_height);
}

window.addEventListener("scroll", header_adjust_with_scroll);
onMounted(() => set_header_space(header_elem.value.offsetHeight));
</script>

<template>
  <header class="fixed w-screen flex items-center px-7 py-5 font-nasalization text-2xl font-bold shadow-sm bg-red-600 text-white transition-all shadow-sm z-50" :class="header_class" ref="header_elem">
    <div>
      <RouterLink to="/">
        <div id="header-title">{{ header_title }}</div>
      </RouterLink>
    </div>
    <div class="grow"></div>
    <div class="account-buttons flex justify-between gap-4 text-base">
      <RouterLink to="/organisation_signup">
        <button
          class="rounded-sm border border-white px-4 py-1.5 shadow-sm transition-shadow duration-200 hover:shadow-md"
        >
          Sign Up
        </button>
      </RouterLink>
      <RouterLink to="/login">
        <button
          class="rounded-sm bg-white text-red-800 px-4 py-1.5 shadow-sm transition-shadow duration-200 hover:shadow-md"
        >
          Log In
        </button>
      </RouterLink>
    </div>
  </header>
  <div class="header-fake-space transition" :style="header_space_style"></div>
  <NotificationGroup positioning="top-28" :messages="messages" />
</template>

<style scoped>
.shrink-header {
  @apply py-3;
}
</style>
