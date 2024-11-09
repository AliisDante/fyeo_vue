<template>
  <ActionBarInclude>
  <div>
    <input type="file" @change="handleImageUpload">
    <button @click="toggleDrawingMode">Add Manual Redaction</button>
    <button @click="removeObject" :disabled="!isObjectSelected">Remove</button>
    <button @click="downloadImage">Download Image</button>
    <br><br>
    <canvas id="canvas" ref="canvas" width="500" height="333"></canvas>
    <br>
    <div id="svg">{{ svgCode }}</div>
  </div>
</ActionBarInclude>
</template>

<script>
import { fabric } from 'fabric';


export default {
  data() {
    return {
      canvas: null,
      isDrawingMode: false,
      isObjectSelected: false,
      svgCode: ''
    };
  },
  mounted() {
    this.canvas = new fabric.Canvas(this.$refs.canvas, { isDrawingMode: false });
    this.setupEventListeners();
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          this.canvas.setDimensions({ width: img.width, height: img.height });
          const fabricImage = new fabric.Image(img);
          this.canvas.setBackgroundImage(fabricImage);
          this.canvas.renderAll();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    toggleDrawingMode() {
      this.isDrawingMode = !this.isDrawingMode;
      this.canvas.isDrawingMode = this.isDrawingMode;
      if (this.isDrawingMode) {
        this.canvas.freeDrawingBrush.width = 10; // Set the thickness when entering drawing mode
    }
    },

    removeObject() {
      this.canvas.isDrawingMode = false;
      const activeObject = this.canvas.getActiveObject();
      if (activeObject) {
        this.canvas.remove(activeObject);
      }
    },

    downloadImage() {
      const dataURL = this.canvas.toDataURL({ format: 'png' });
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'my_image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    setupEventListeners() {
      this.canvas.on('selection:created', () => {
        this.isObjectSelected = true;
      });
      this.canvas.on('selection:cleared', () => {
        this.isObjectSelected = false;
      });
    }
  }
};
</script>
<script setup>
import ActionBarInclude from '../components/ActionBarInclude.vue'
</script>

<style scoped>
button {
  background-color: #ffffff;
  border-radius: 4px;
  border: 1px solid #dcdcdc;
  font-weight: bold;
  padding: 5px 20px;
  cursor: pointer;
}
button:hover {
  background-color: #f6f6f6;
}
</style>
