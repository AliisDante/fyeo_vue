<script setup>
import { ref, onMounted } from 'vue';
import { Watermark } from '@watermarkify/vue-watermark'


const watermarkOptions = ref({
  content: 'Copyright ©',
  gap: [20, 20],
  offset: [10, 10],
  zIndex: 5,
  rotate: -20,
  length: 40,
  width: 60,
  fontSize: 90,
})

</script>



<template>

            <div>
                <Watermark :options="watermarkOptions">
                    <img src="src\assets\document1.jpg" alt="Example Image">
                </Watermark>
                </div>

</template>