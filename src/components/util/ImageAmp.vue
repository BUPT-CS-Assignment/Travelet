<template>
<v-dialog v-model="flag" fullscreen style="backdrop-filter: blur(10px);">
  <v-btn icon="" variant="text" color="red" size="large" style="position:absolute; top:20px; right: 20px; z-index:10;"
    @click="flag = false"
  >
    <v-icon size="large">mdi-close</v-icon>
  </v-btn>
  <div style="width: 100%; height: 100%;" class="d-flex justify-center align-center">
    <v-img :src="src" 
      lazy-src="https://fakeimg.pl/400x300/?retina=1&text=image&font=lobster"
      :max-width="maxWidth" :max-height="maxHeight"
    >
    </v-img>
  </div>

</v-dialog>
</template>

<script setup>
import { fileURL } from '@/plugins/query';
import { ref } from 'vue';

const src = ref(null);
const flag = ref(false);
const maxHeight = ref(window.innerHeight * 0.9)
const maxWidth = ref(window.innerWidth * 0.9)

function url(id) {
  flag.value = true;
  src.value = fileURL(id);
}

function raw(file) {
  flag.value = true;
  src.value = file;
}

defineExpose({
  url,
  raw
})
</script>