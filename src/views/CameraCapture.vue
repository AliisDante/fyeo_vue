<template>
  <div class="container">
    <h1>FACEIO Integration</h1>
    <div ref="faceioContainer"></div>
  </div>
</template>

<script>
import { onMounted } from 'vue';

export default {
  name: 'FaceIOIntegration',
  setup() {
    // Initialize the library first with your application Public ID.
    // Grab your public ID from the Application Manager on the FACEIO console at: https://console.faceio.net/
    const faceIO = new faceIO('fioa1f93'); // Replace with your application Public ID

    onMounted(() => {
      // Initialize face detection on component mount
      faceIO.startFaceDetection(document.getElementById('faceioContainer'), {
        onFaceDetected: (faces) => {
          // Log detected faces to console
          console.log('Detected faces:', faces);
        },
        onError: (error) => {
          // Log any errors to console
          console.error('Face detection error:', error);
        }
      });
    });
  }
};
</script>

<style>
.container {
  text-align: center;
}
</style>
