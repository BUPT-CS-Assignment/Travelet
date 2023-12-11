<template>
<div class="d-flex justify-center">
  <div class="d-flex flex-column py-10" style="max-width: 1000px;">
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
        {{ Request.location }}
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
        <p class="text-subtitle-2 my-1">
          发布时间: {{ Request.create_time }}
        </p>

        <!-- date -->
        <p class="text-subtitle-2 my-1">
          修改时间: {{ Request.modify_time }}
        </p>

        <!-- <p class="text-blue-accent-2 text-subtitle-2 my-1">
          RESPONSED: {{ Response.date }}
        </p> -->
        
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
        <v-carousel v-if="Request.images.length > 0"
          cycle show-arrows="hover"
          hide-delimiter-background
          height="300"
        >
          <v-carousel-item v-for="(uid, index) in Request.images">
            <v-img :src="QUERY.fileURL(uid)" cover :no-transition="true"
              lazy-src="https://fakeimg.pl/400x300/?retina=1&text=image&font=lobster"
            ></v-img>
          </v-carousel-item>

        </v-carousel>
        
      </div>
    </div>

    <v-spacer class="my-3"/>

    <!-- desc -->
    <v-card variant="tonal" color="grey"> 
      <v-card-title class="d-flex text-grey-darken-2">
        描述
      </v-card-title>
      <v-card-text class="d-flex text-grey-darken-2">
        {{ Request.desc }}
      </v-card-text>
    </v-card>

    <v-divider class="my-4"/>

    <!-- personal response -->
    <template v-if="1 in Response">
      <p class="ml-2 text-h6 font-weight-bold">我的响应</p>
      <detail-response :uid="1" :modified="true"></detail-response>
    </template>
    <template v-else>
      <v-btn class="mb-4" elevation="0" color="blue-accent-2">
        去响应
      </v-btn>
    </template>
    
    <v-divider class="my-6"/>

    <!-- all responses -->
    <div>
      <template v-for="(uid, index) in Response">
        <div v-if="uid != 1">
          <detail-response :uid="uid" :acceptable="true"></detail-response>
          <v-divider v-if="index != Response.length - 1" class="my-3"/>
        </div>
      </template>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import DetailResponse from '@/components/DetailResponse.vue'
import * as FILES from '@/plugins/files'
import * as QUERY from '@/plugins/query'
import { onMounted } from 'vue';


const Route = useRoute();
const POST_ID = Route.params.id;

const StatusString = [
  {text:'进行中', color:'green'},
  {text:'已完成', color:'blue-accent-3'},
  {text:'已取消', color:'red'},
  {text:'已过期', color:'grey'}
]

const Request = reactive({
  location: '',
  tags: [],
  create_time: '',
  modify_time: '',
  biref: '',
  desc: '',
  status: 0,
  images: [],
  files: []
})

const Response = reactive([1,2,3,4])
// const Response = reactive({
//   available: false,
//   tags: ['tag1','tag2'],
//   date: '2023.11.28',
//   desc: 'description',
//   imgs: ['https://cdn.vuetifyjs.com/images/cards/house.jpg', 
//     'https://cdn.vuetifyjs.com/images/cards/road.jpg',
//     'https://cdn.vuetifyjs.com/images/cards/plane.jpg'
//   ],
//   files: [

//   ]
// })

onMounted(() => {
  QUERY.get('/api/user/request/query_detail',{
    request_id : POST_ID
  })
  .then(data => {
    const info = data.data;
    Request.location = info.city;
    Request.create_time = info.create_time;
    Request.modify_time = info.modify_time;
    Request.biref = info.title;
    Request.tags = info.tags;
    Request.desc = info.description;
    Request.status = info.status;
    Request.images = info.image_files;
    Request.files = info.raw_files;
  })
  
  
})

</script>