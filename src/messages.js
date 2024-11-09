import { ref } from 'vue'

let messages = ref([]);

function add_message(type, message) {
  messages.value.unshift({type, message});
}

function delete_message(index) {
  messages.value.splice(index, 1);
}

export { messages, add_message, delete_message };
