<template>
<div class="d-flex justify-center">
  <div class="d-flex flex-column py-10" style="max-width: 800px;">
    <!-- status & location -->
    <div class="d-flex flex-row mb-3">
      <v-chip label variant="flat" 
        :color="StatusString[BindData.status].color"
      >
        {{ StatusString[BindData.status].text }}
      </v-chip>

      <v-chip class="ml-3 font-weight-bold" 
        label color="grey-darken-2"
      >
        {{ BindData.location }}
      </v-chip>
    </div>

    <!-- introduction -->
    <div class="d-flex flex-row flex-wrap">
      <!-- basic info -->
      <div class="d-flex flex-column align-self-start mr-10"
        style="max-width: 400px;"
      >
        <!-- title -->
        <p class="text-h3 font-weight-bold mb-2" style="word-break: break-all;">
          {{ BindData.biref }}
        </p>

        <!-- date -->
        <p class="text-subtitle-2 my-1">
          发布时间: {{ BindData.create_time }}
        </p>

        <!-- date -->
        <p class="text-subtitle-2 my-1">
          修改时间: {{ BindData.modify_time }}
        </p>

        <!-- <p class="text-blue-accent-2 text-subtitle-2 my-1">
          RESPONSED: {{ BindReply.date }}
        </p> -->
        
        <v-divider width=300 class="mt-4 mb-2" />

        <!-- tags -->
        <div class="d-flex flex-row flex-wrap">
          <template v-for="(tag, index) in BindData.tags">
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
        <v-carousel v-if="BindData.images.length > 0"
          cycle show-arrows="hover"
          hide-delimiter-background
          height="200"
        >
          <v-carousel-item v-for="(item, index) in BindData.images">
            <v-img :src="QUERY.fileURL(item.id)" cover
              lazy-src="https://fakeimg.pl/400x300/?retina=1&text=image&font=lobster"
              @click="RefImageAmp.url(item.id)"
            ></v-img>
          </v-carousel-item>

        </v-carousel>
        
      </div>
    </div>

    <v-spacer class="my-3"/>

    <!-- desc -->
    <template v-if="!Modify">
      <div>
        <p>{{ BindData.desc }}</p>
      </div>
    </template>
    <template v-if="Modify">

    </template>    

    <!-- personal response -->
    <template v-if="!checkIsPoster">
      <v-divider class="my-4"/>
      <template v-if="BindReply.personal">
        <p class="ml-2 text-h6 font-weight-bold">我的响应</p>
        <response-view 
          :response_id="BindReply.personal" 
          :modified="BindData.status == 0"
        />
      </template>
      <template v-else-if="Status.loaded">
        <template v-if="!Status.dialog">
          <v-btn class="mb-4" elevation="0" color="blue-accent-2" @click="Status.dialog = true">
            去响应
          </v-btn>
        </template>
        <template v-else>
          <response-view 
            modify_at_init
            :modified="true"
            :responder_id="USER_ID"
            :request_id="REQUEST_ID" 
            :on_cancel="()=>{Status.dialog=false;}"
            :on_success="()=>{Status.dialog=false;}"
          />
        </template>
      </template>
    </template>
    
    

    <!-- all responses -->
    <div>
      <p class="ml-2 mt-10 text-h6 font-weight-bold">所有响应</p>
      <template v-for="(uid, index) in BindReply.rest">
        <v-divider class="my-3"/>
        <response-view 
          :response_id="uid" 
          :modified="BindData.status == 0"
          :acceptable="checkIsPoster"
        />
      </template>
    </div>
  </div>
</div>

<image-amp ref="RefImageAmp"></image-amp>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter  } from 'vue-router';
import ResponseView from '@/components/Response.vue'
import ImageAmp from '@/components/util/ImageAmp.vue';

import * as FILES from '@/plugins/files'
import * as QUERY from '@/plugins/query'
import {assert} from '@/plugins/query'

///// router
const Route = useRoute();
const Router = useRouter();

///// const values
const REQUEST_ID = Number(Route.params.id);
const USER_ID = Number(QUERY.get_user_id());
const StatusString = [
  {text:'进行中', color:'green'},
  {text:'已完成', color:'blue-accent-3'},
  {text:'已取消', color:'red'},
  {text:'已过期', color:'grey'},
  {text:'加载中', color:'grey'}
]

///// ref
const Status = reactive({
  dialog: false,
  loaded: false,
  modify: false
})
const RefImageAmp = ref(null);

///// v-model
const BindInput = reactive({
  tags: [],
  desc: '',
  images: [],
  files: []
})

const BindData = reactive({
  poster_id: NaN,
  location: '',
  tags: [],
  create_time: '',
  modify_time: '',
  biref: '',
  desc: '',
  status: 4,
  images: [],
  files: []
})

const BindReply = reactive({
  personal: NaN,
  accepted: NaN,
  rest: []
})

///// rules
const checkIsPoster = computed(() => {
  return USER_ID == BindData.poster_id;
})

///// functions
function resetInput() {
  Input.tags = BindData.tags;
  Input.desc = BindData.desc;
  Input.images = BindData.images;
  Input.files = BindData.files;
}





function filterResponse(data) {
  BindReply.personal = NaN;
  BindReply.rest = []
  data.forEach(element => {
    if(element.responder_id == USER_ID) {
      BindReply.personal = element.id;
    } else if(element.id != BindReply.accepted) {
      BindReply.rest.push(element.id);
    }
  });
}

function init() {
  QUERY.get('/api/user/request/query_detail',{
    request_id : REQUEST_ID
  })
  .then(data => {
    console.log(data)
    const info = data.data;
    BindData.poster_id = Number(info.poster_id);
    BindData.location = info.city;
    BindData.create_time = info.create_time;
    BindData.modify_time = info.modify_time;
    BindData.biref = info.title;
    BindData.tags = info.tags;
    BindData.desc = info.description;
    BindData.status = info.status;
    BindData.images = info.image_files;
    BindData.files = info.raw_files;
    BindReply.accepted = info.accepted_response_id;
    filterResponse(info.pending_responses);
    Status.loaded = true;
  })
}

onMounted(() => {
  if(!assert()) {
    Router.push('/login');
    return;
  }
  
  init();
})

</script>