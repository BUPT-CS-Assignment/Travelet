<template>
<v-hover>
  <template v-slot:default="{ isHovering, props }">
    <v-card 
      rounded="lg" variant="flat" 
      min-width=400 max-width=800 
      v-bind="props"
      :elevation="isHovering ? 6 : 1"
      @click=""
    >
      <v-img :src="Data.imgs[0]"
        aspect-ratio="4/3"
        
      />
      
      <!-- content -->
      <div class="ma-6">
        <!-- indicator -->
        <div class="my-2" :class="isHovering ? 'mr-8' : 'mr-6'"
          style="position: absolute;right: 0px;"
        >
          <v-avatar v-for="i in 3"
            size="5" style="margin-left: 3px;"
            :color="isHovering ? 'blue-accent-3':'grey-lighten-2'"
          />
        </div>
        
        <!-- titel -->
        <p class="text-h5" style="margin-right: 20px;">
          {{ Data.biref }}
        </p>

        <v-spacer class="my-1"></v-spacer>

        <!-- date -->
        <p class="text-blue-accent-2 text-caption">
          POSTED: {{ Data.date }}
        </p>

        <v-spacer class="my-1"></v-spacer>

        <div class="d-flex">
          <v-chip size="small" v-for="(tag, index) in Data.tags"
            class="mr-1" color="grey" style="z-index:9"
            @click="console.log(1)"
          > 
            <strong class="text-blue-accent-3">#</strong>
            <p class="text-black">{{ tag }}</p>
          </v-chip>
        </div>
      </div>
    </v-card>
  </template>
</v-hover>
</template>

<script setup>
import { ref, reactive } from 'vue';


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
  tags: ['tag1','tag2'],
  date: '2023.11.28',
  biref: 'Brief Description',
  imgs: ['https://cdn.vuetifyjs.com/images/cards/house.jpg', 
    'https://cdn.vuetifyjs.com/images/cards/road.jpg',
    'https://cdn.vuetifyjs.com/images/cards/plane.jpg'
  ],
})


</script>