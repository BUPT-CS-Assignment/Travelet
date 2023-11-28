<template>
<v-card hover rounded="lg" min-width=220 max-width=600 max-height=300>
  <div style="position: absolute; z-index: 2; bottom: 0;">
    <v-card-title>
      <template v-if="props.type === 'region'">
        <p>{{ Data.province }}, {{ Data.city }}</p>
      </template>
      <template v-else>
        <p>{{ Data.keywords }}</p>
      </template>
    </v-card-title>
    <v-card-subtitle>
      <p>{{ Data.date }}</p>
    </v-card-subtitle>
    <v-card-text>
      <p>{{ Data.desc }}</p>
    </v-card-text>
  </div>

  <!-- background -->
  <v-img :src="Data.imgs[getRandomInt(3)]"
    class="align-end"
    gradient="to bottom, rgba(255,255,255,.33), rgba(255,255,255,1)"
    cover
  />
</v-card>
</template>

<script setup>
import { reactive } from 'vue';

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