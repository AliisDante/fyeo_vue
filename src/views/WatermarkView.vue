<script setup>
import ActionBarInclude from '../components/ActionBarInclude.vue';
import { ref, onMounted, watchEffect, reactive } from 'vue';
import { Watermark } from '@watermarkify/vue-watermark';

const watermarkOptions = reactive({
  content: "FYEO",
  gap: [20, 20],
  offset: [10, 10],
  zIndex: 5,
  rotate: -20,
  width: 40,
  height: 50,
});

const imgData = ref("");

async function onFileChanged(event) {
  const targetFile = event.target.files[0];
  await openPreview(targetFile);
}

async function openPreview(fileObject) {
  const reader = new FileReader();
  const dataUrl = await new Promise((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(fileObject);
  });

  imgData.value = dataUrl;
}


watchEffect(() => {
  if (imgData.value) {
    console.log('Image data loaded:', imgData.value);
    
  }
});
</script>

<template>
  <ActionBarInclude>
    <div class="flex justify-center items-center h-full">
      <div class="w-full p-4">
        <input type="file" id="myfile" name="myfile" @change="onFileChanged($event)" style="margin-left: 540px; margin-bottom: 40px;">
        <div v-if="imgData !== ''" class="flex justify-center">
          <Watermark :options="watermarkOptions">
            <img :src="imgData" />
          </Watermark>
        </div>
      </div>
    </div>
  </ActionBarInclude>
</template>


