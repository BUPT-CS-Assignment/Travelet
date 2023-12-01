<template>
<v-hover>
  <template v-slot:default="{ isHovering, props }">
    <v-card 
      rounded="lg" variant="flat" 
      min-width=400 max-width=800 
      v-bind="props"
      :elevation="isHovering ? 10 : 1"
      @click="Dialog = true;"
    >
      <v-img :src="Data.imgs[getRandomInt(3)]"
        aspect-ratio="4/3"
      />

      <v-card-title>
        <template v-if="props.type === 'region'">
          <p>{{ Data.province }}, {{ Data.city }}</p>
        </template>
        <template v-else>
          <p>{{ Data.keywords }}</p>
        </template>
      </v-card-title>

      <v-card-subtitle class="my-5">
        <p>{{ Data.date }}</p>
      </v-card-subtitle>
      <v-divider></v-divider>
      <v-card-text>
        <p>{{ Data.desc }}</p>
      </v-card-text>

      <!-- background -->
      
    </v-card>
  
  
  
  
  </template>
</v-hover>

<v-dialog
  v-model="Dialog"
  width="85%"
  height="80%"
>
  <v-card height="100%" rounded="lg">
    <v-card-title>
      探索世界
    </v-card-title>

    <v-card-text>

    </v-card-text>
  </v-card>
</v-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue';

const Dialog = ref(false);

const props = defineProps({
  type: {
    type: String,
    default: 'region',
    validator: (val) => {
      return ['region', 'keyword'].includes(val)
    }
  }
})

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const Data = reactive({
  province: 'Province',
  city: 'City',
  date: '2023.11.28',
  keywords: 'Keywords',
  desc: 'Biref Description',
  imgs: ['https://cdn.vuetifyjs.com/images/cards/house.jpg', 
    'https://cdn.vuetifyjs.com/images/cards/road.jpg',
    'https://cdn.vuetifyjs.com/images/cards/plane.jpg'
  ],
})


</script>