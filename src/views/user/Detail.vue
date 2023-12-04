<template>
<div class="d-flex flex-column pa-10">
  <!-- status & location -->
  <div class="d-flex flex-row mb-3">
    <v-chip label variant="flat" 
      :color="StatusString[Request.status].color"
    >
      {{ StatusString[Request.status].text }}
    </v-chip>

    <v-chip class="ml-3 font-weight-bold" 
      label color="grey-darken-2"
    >
      {{ Request.loc1 }}, {{ Request.loc2 }}
    </v-chip>
  </div>

  <!-- introduction -->
  <div class="d-flex flex-row flex-wrap">
    <!-- basic info -->
    <div class="d-flex flex-column align-self-start mr-10"
      style="max-width: 400px;"
    >
      <!-- title -->
      <p class="text-h3" style="word-break: break-all;">
        {{ Request.biref }}
      </p>

      <!-- date -->
      <p class="text-blue-accent-2 text-subtitle-2 my-1">
        POSTED: {{ Request.date }}
      </p>

      <p class="text-blue-accent-2 text-subtitle-2 my-1">
        RESPONSED: {{ Response.date }}
      </p>
      
      <v-divider width=300 class="mt-4 mb-2" />

      <!-- tags -->
      <div class="d-flex flex-row flex-wrap">
        <template v-for="(tag, index) in Request.tags">
          <p class="mr-2 text-body-2 font-weight-bold">
            <strong class="text-blue-accent-3">#</strong>
            {{ tag }}
          </p>
        </template>
      </div>

      <v-spacer class="my-3" />
    </div>

    <!-- request imgs -->
    <div class="flex-grow-1 mx-auto" 
      style="min-width: 400px; max-width: 800px;"
    >
      <v-window show-arrows>
        <v-window-item
          v-for="(img, index) in Request.imgs"
          :key="index"
        >
          <v-card rounded="lg" >
            <v-img
              :src="img"
              cover
              aspect-ratio="16/9"
            />
          </v-card>
        </v-window-item>
      </v-window>
    </div>
  </div>

  <v-spacer class="my-6"/>

  <!-- desc -->
  <v-card variant="tonal" color="grey">
    <v-card-title class="d-flex text-grey-darken-2">
      期望描述
    </v-card-title>
    <v-card-text class="d-flex text-grey-darken-2">
      {{ Response.desc }}
    </v-card-text>
  </v-card>

  <!-- to response -->
  <v-btn class="mt-4" elevation="0" color="blue-accent-2">
    去响应
  </v-btn>

  <!-- response content -->
  <div class="d-flex flex-column mt-6">
    <p class="align-self-center text-h6 font-weight-black">描述</p>
    
    <v-divider/>
    <p class="text-body-1 my-1">
      
    </p>
  </div>

</div>
</template>

<script setup>
import { ref } from 'vue';
import { reactive } from 'vue';
import { useRoute } from 'vue-router';

const Route = useRoute();
const id = Route.params.id;


const StatusString = [
  {text:'进行中', color:'green'},
  {text:'已完成', color:'blue-accent-3'},
  {text:'已取消', color:'red'},
  {text:'已过期', color:'grey'}
]

const Request = reactive({
  loc1: '北京市',
  loc2: '海淀区',
  tags: ['tag1','tag2'],
  date: '2023.11.28',
  biref: 'Brief Title AAAAAAA BBBBBBB CCCCCCC',
  desc: 'Description',
  status: 0,
  imgs: ['https://cdn.vuetifyjs.com/images/cards/house.jpg', 
    'https://cdn.vuetifyjs.com/images/cards/road.jpg',
    'https://cdn.vuetifyjs.com/images/cards/plane.jpg'
  ],
  files: [

  ]
})

const Response = reactive({
  available: false,
  tags: ['tag1','tag2'],
  date: '2023.11.28',
  desc: 'description',
  imgs: ['https://cdn.vuetifyjs.com/images/cards/house.jpg', 
    'https://cdn.vuetifyjs.com/images/cards/road.jpg',
    'https://cdn.vuetifyjs.com/images/cards/plane.jpg'
  ],
  files: [

  ]
})

</script>