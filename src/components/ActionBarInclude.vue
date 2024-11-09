<script setup>
defineProps(["active_nav"])

import { ref, onMounted } from 'vue';
import ActionBarNavItem from './ActionBarNavItem.vue'
import IconKey from './icons/IconKey.vue';
import IconLock from './icons/IconLock.vue';
import IconSettings from './icons/IconSettings.vue';
import IconBox from './icons/IconBox.vue';
import IconLogout from './icons/IconLogout.vue';
import NotificationGroup from './NotificationGroup.vue'
import IconUser from './icons/IconUser.vue'

import { header_long_title, header_short_title, header_title, header_open } from '../store/ActionBarStore.js'
import { messages } from '../messages.js'

let header_class = ref("header-closed");
let header_elem = ref(null);
let header_space_style = ref(null);

let last_text = "";
let pending_typewrites = [];
function typewrite_text(elem_text, text) {
  if (last_text == text) {
    return;
  }
  for (const i of pending_typewrites) {
    clearTimeout(i);
  }
  pending_typewrites = [];

  let iter_index = 0;
  for (let i = 0; i < elem_text.value.length; i++) {
    let wait_duration = iter_index * 30;
    let new_timeout = setTimeout(() => {
      elem_text.value = elem_text.value.slice(0, -1);
      set_header_spacing();
    }, wait_duration);
    setTimeout(() => set_header_spacing(), wait_duration + 0.0000000000001);
    pending_typewrites.push(new_timeout);
    iter_index++;
  }

  let base_timeout_for_write = iter_index * 30;

  iter_index = 0;
  for (const c of text) {
    let wait_duration = base_timeout_for_write + (iter_index * 30);
    let new_timeout = setTimeout(() => {
      elem_text.value += c
    }, wait_duration);
    setTimeout(() => set_header_spacing(), wait_duration + 0.0000000000001);
    pending_typewrites.push(new_timeout);
    iter_index++;
  }
  last_text = text;
}

function sync_header_with_state() {
  if (header_open.value) {
    header_class.value = "header-open";
  }
  else {
    header_class.value = "header-closed";
  }
}

function header_button_pressed() {
  header_open.value = !header_open.value;
  sync_header_with_state();
  if (header_open.value) {
    typewrite_text(header_title, header_long_title)
  }
  else {
    typewrite_text(header_title, header_short_title)
  }
}

function set_header_spacing() {
  header_space_style.value = `padding-left: ${header_elem.value.offsetWidth}px;`;
}

onMounted(() => {
  setTimeout(() => {
    set_header_spacing()
    sync_header_with_state();
  }, 30);
});
</script>

<template>
  <header class="bg-gradient-to-b from-red-700 via-red-700 to-red-500 fixed h-screen shadow-sm pl-7 pr-12 py-6 font-nasalization text-white flex flex-col" :class="header_class" ref="header_elem">
    <RouterLink to="/" class="mt-4 mb-7">
      <div id="header-title" class="font-bold text-2xl">{{ header_title }}​</div>
    </RouterLink>
    <div class="absolute -right-3 h-screen flex items-center top-0">
      <button class="header-button transition-transform duration-300 shadow-md p-2 w-8 h-8 text-base flex items-center justify-center font-bold rounded-sm bg-white text-black" @click="header_button_pressed" :class="header_class">«</button>
    </div>
    <nav class="flex flex-col items-start gap-y-5" :class="header_class">
      <ActionBarNavItem link_to="/files" description="Files" nav_name="files" :active_nav="active_nav" :header_class="header_class"><IconBox /></ActionBarNavItem>
      <ActionBarNavItem link_to="/drm" description="DRM" nav_name="drm" :active_nav="active_nav" :header_class="header_class"><IconLock /></ActionBarNavItem>
      <ActionBarNavItem link_to="/keys" description="Keys" nav_name="keys" :active_nav="active_nav" :header_class="header_class"><IconKey class="w-6 h-6" /></ActionBarNavItem>
      <ActionBarNavItem link_to="/users" description="Users" nav_name="users" :active_nav="active_nav" :header_class="header_class"><IconUser class="w-7 h-7"/></ActionBarNavItem>
      <ActionBarNavItem link_to="/policies" description="Policies" nav_name="policies" :active_nav="active_nav" :header_class="header_class"><IconSettings /></ActionBarNavItem>
      <ActionBarNavItem link_to="/tools" description="Tools" nav_name="classification" :active_nav="active_nav" :header_class="header_class"><IconSettings /></ActionBarNavItem>

    </nav>
    <div class="middle-space grow"></div>
    <div class="bottom-row">
      <RouterLink to="/logout" class="block p-2 w-10 h-10 border border-white rounded-sm shadow-sm hover:shadow-md hover:bg-white hover:text-red-600">
        <IconLogout />
      </RouterLink>
    </div>
  </header>
  <div class="header-fake-space" :style="header_space_style">
    <slot />
  </div>
  <NotificationGroup :messages="messages" positioning="top-16" />
</template>

<style scoped>
.header-button.header-closed {
  transform: rotate(0.5turn);
}

nav.header-closed span.nav-description {
  @apply hidden;
}

nav.header-closed {
  @apply items-center;
}
</style>
