<template>
<v-dialog v-model="flag" fullscreen style="backdrop-filter: blur(10px);">
  <v-btn icon="" variant="text" color="red" size="large" style="position:absolute; top:20px; right: 20px; z-index:10;"
    @click="flag = false"
  >
    <v-icon size="large">mdi-close</v-icon>
  </v-btn>
  <div style="width: 100%; height: 100%;" class="d-flex justify-center align-center">
    <v-img :src="fileURL(uid)" 
      lazy-src="https://fakeimg.pl/400x300/?retina=1&text=image&font=lobster"
      :max-width="maxWidth" :max-height="maxHeight"
    >
    </v-img>
  </div>

</v-dialog>
</template>

<script setup>
import { fileURL } from '@/plugins/query';
import { onMounted } from 'vue';
import { ref } from 'vue';

const flag = ref(false);
const uid = ref(NaN)
const maxHeight = ref(window.innerHeight * 0.9)
const maxWidth = ref(window.innerWidth * 0.9)


function check(id) {
  uid.value = id
  flag.value = true;
}

defineExpose({
  check
})
</script>