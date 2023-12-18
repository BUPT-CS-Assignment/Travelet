<template>
<v-dialog v-model="flag" style="backdrop-filter: blur(10px);">
  <div style="width: 100%;">
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

onMounted(() => {
  console.log(window.innerHeight)
})

function check(id) {
  uid.value = id
  flag.value = true;
}

defineExpose({
  check
})
</script>