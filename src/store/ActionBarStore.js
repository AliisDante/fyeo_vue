import { ref } from 'vue'

let header_long_title = 'FOR YOUR EYES ONLY';
let header_short_title = 'FYEO';
let header_title = ref(header_short_title);
let header_open = ref(false);

export { header_long_title, header_short_title, header_title, header_open };
