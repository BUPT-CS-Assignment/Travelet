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
      <div class="my-2" :class="isHovering ? 'ml-4' : 'ml-6'">
        <v-avatar v-for="i in 3"
          size="5" style="margin-left: 3px;"
          :color="StatusString[Data.status].color"
        />
      </div>

      <div class="mx-6 mb-6">

        <p class="text-h6">
          {{ Data.biref }}
        </p>

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
      
      
      <div class="d-flex flex-row px-6 py-2" style="background-color: #f2f2f2;">
        <v-row class="text-grey text-body-2 font-weight-bold">
          <v-col class="d-flex">
            <p class="align-self-center">
            {{ StatusString[Data.status].text }}
          </p>
          </v-col>
          <v-col class="d-flex">
            <p class="align-self-center">
              {{ Data.loc1 }}, {{ Data.loc2 }}
            </p>
          </v-col>
          <v-col class="d-flex">
            <p class="ml-auto text-overline">
              {{ Data.date }}
            </p>
          </v-col>
        </v-row>
        
        
        
      </div>
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

const StatusString = [
  {text:'进行中', color:'green'},
  {text:'已完成', color:'blue-accent-3'},
  {text:'已取消', color:'red'},
  {text:'已过期', color:'grey'}
]

const Data = reactive({
  loc1: '北京市',
  loc2: '海淀区',
  tags: ['tag1','tag2'],
  date: '2023.11.28',
  biref: 'Brief Description',
  status: 0,
  imgs: ['https://cdn.vuetifyjs.com/images/cards/house.jpg', 
    'https://cdn.vuetifyjs.com/images/cards/road.jpg',
    'https://cdn.vuetifyjs.com/images/cards/plane.jpg'
  ],
})


</script>