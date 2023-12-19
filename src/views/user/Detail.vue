<template>
<div class="d-flex justify-center">
  <div class="d-flex flex-column py-10" style="max-width: 800px;">
    <!-- status & location -->
    <div class="d-flex flex-row mb-3">
      <v-chip label variant="flat" :color="StatusString[BindData.status].color">
        {{ StatusString[BindData.status].text }}
      </v-chip>

      <v-chip v-if="Status.loaded" class="ml-3 font-weight-bold" label color="grey-darken-2">
        {{ BindData.location }}
      </v-chip>

      <template v-if="Status.loaded && checkIsPoster">
        <template v-if="!Status.modify">
          <v-chip  :disabled="!checkIsPoster" 
            class="ml-3 font-weight-bold" 
            label color="blue-accent-3" 
            @click="openModify"
          >
            修改
          </v-chip>
        </template>
        <template v-else>
          <v-chip class="ml-3 font-weight-bold" label color="deep-orange" @click="Status.modify = false">
            取消
          </v-chip>
          <v-chip class="ml-3 font-weight-bold" label color="blue-accent-3" 
            @click=""
          >
            保存
          </v-chip>

        </template>

      </template>
      
    </div>

    <!-- introduction -->
    <div class="d-flex flex-row flex-wrap">
      <!-- basic info -->
      <div style="max-width: 400px;" class="d-flex flex-column align-self-start mr-10">
        <!-- title -->
        <p class="text-h3 font-weight-bold mb-2" style="word-break: break-all;"> {{ BindData.biref }} </p>

        <!-- post time -->
        <p class="text-subtitle-2 my-1"> 发布时间: {{ BindData.create_time }} </p>
        <!-- modify time -->
        <p class="text-subtitle-2 my-1"> 修改时间: {{ BindData.modify_time }} </p>

        <!-- <p class="text-blue-accent-2 text-subtitle-2 my-1">
          RESPONSED: {{ BindReply.date }}
        </p> -->
        
        <v-divider width=300 class="mt-4 mb-2" />

        <!-- tags -->
        <template v-if="!Status.modify">
          <div class="d-flex flex-row flex-wrap">
            <template v-for="(tag, index) in BindData.tags">
              <p class="mr-2 text-body-2 font-weight-bold">
                <strong class="text-blue-accent-3">#</strong>
                {{ tag }}
              </p>
            </template>
          </div>
        </template>
        <template v-else>
          <tag-bar ref="RefTagInput" :tags="TagsPreset" :preset="BindData.tags" icon="mdi-tag-multiple-outline"></tag-bar>
        </template>
        

        <v-spacer class="my-3" />
      </div>

      <!-- images -->
      <template v-if="!Status.modify">
        <div class="flex-grow-1 mx-auto" style="min-width: 400px; max-width: 800px;">
          <v-carousel v-if="BindData.images.length > 0"
            height="200" show-arrows="hover"
            cycle hide-delimiter-background
          >
            <v-carousel-item v-for="(item, index) in BindData.images">
              <v-img :src="QUERY.fileURL(item.id)" cover
                lazy-src="https://fakeimg.pl/400x300/?retina=1&text=image&font=lobster"
                @click="RefImageAmp.url(item.id)"
              ></v-img>
            </v-carousel-item>
          </v-carousel>
        </div>
      </template>
      <template v-else>
        <v-row class="mt-4">
          <!-- server images -->
          <v-col v-for="(item, index) in BindData.images" cols="auto">
            <v-img @click="RefImageAmp.url(item.id)"
              :src="QUERY.fileURL(item.id)" 
              aspect-ratio="1" min-width="160" cover 
              lazy-src="https://fakeimg.pl/300x300/?retina=1&text=image&font=lobster"
            >
              <div class="d-flex">
                <v-btn @click.stop="" icon="" variant="text" color="red" size="small" class="ml-auto">
                  <v-icon size="large">mdi-close</v-icon>
                </v-btn>
              </div>
            </v-img>
          </v-col>
          <!-- local images -->
          <v-col v-for="(item, index) in BindInput.images" cols="auto">
            <v-img @click="RefImageAmp.raw(BindInput.image_data[index])"
              :src="BindInput.image_data[index]" 
              aspect-ratio="1" cover min-width="200"
            >
              <div class="d-flex">
                <v-btn @click="handleImageRemove(index)" icon="" variant="text" color="red" size="small" class="ml-auto">
                  <v-icon size="large">mdi-close</v-icon>
                </v-btn>
              </div>
            </v-img>
          </v-col>
        </v-row>
      </template>
      
    </div>

    <v-spacer class="my-6"></v-spacer>
    <!-- files -->
    <div rounded="lg" clss="mx-2">
      <!-- server files -->
      <v-list-item v-for="(file, index) in BindData.files" :key="index"
        :title="file.name"
        :subtitle="FILES.formatFileSize(file.size)"
      >
        <template v-slot:prepend>
          <v-icon color="grey-darken-3"> {{ FILES.iconFileType(file.type) }} </v-icon>
        </template>
        <template v-if="Status.modify" v-slot:append>
          <v-btn @click="" icon="" variant="text" color="red" size="small">
            <v-icon size="large">mdi-close</v-icon>
          </v-btn>
        </template>
      </v-list-item>
      <!-- local files -->
      <template v-if="Status.modify">
        <v-file-input
          style="position: absolute;display: none;"
          ref="RefFileInput"
          @change="(event) => handleFileInput(event)"
          multiple
        />
        <v-list-item v-for="(file, index) in BindInput.files" :key="index"
          :title="file.name"
          :subtitle="FILES.formatFileSize(file.size)"
        >
          <template v-slot:prepend>
            <v-icon color="grey-darken-3"> {{ FILES.iconFileType(file.type) }} </v-icon>
          </template>
          <template v-slot:append>
            <v-btn @click="handleFileRemove(index)" icon="" variant="text" color="red" size="small">
              <v-icon size="large">mdi-close</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </template>
    </div>

    <v-spacer class="my-3"/>

    <!-- desc -->
    <template v-if="!Status.modify">
      <p style="word-break: break-all;">{{ BindData.desc }}</p>
    </template>
    <template v-else>
      <v-textarea 
        rounded="lg"
        v-model="BindInput.desc"
        auto-grow
        hide-details
        variant="outlined"
        class="mb-2"
      />
    </template>    

    <!-- responses -->
    <responses v-if="Status.loaded"></responses>
  </div>
</div>

<template v-if="Status.modify">
  <v-file-input ref="RefImageInput"
    style="position: absolute;display: none;" accept="image/*"
    @change="(event) => handleImageInput(event)"
    multiple
  />
  <v-file-input
    style="position: absolute;display: none;"
    ref="RefFileInput"
    @change="(event) => handleFileInput(event)"
    multiple
  />
</template>

<image-amp ref="RefImageAmp"></image-amp>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter  } from 'vue-router';
import Responses from '@/views/user/Responses.vue'
import ImageAmp from '@/components/util/ImageAmp.vue';
import TagBar from '@/components/util/TagBar.vue';

import TagsPreset from '@/plugins/tags'
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
  loaded: false,
  modify: false
})
const RefImageAmp = ref(null);
const RefImageInput = ref(null);
const RefFileInput = ref(null);
const RefTagInput = ref(null);

///// v-model
const BindInput = reactive({
  desc: '',
  images: [],
  files: [],
  image_data: []
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

///// rules
const checkIsPoster = computed(() => {
  return USER_ID == BindData.poster_id;
})


///// images
function handleImageInput(event) {
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    BindInput.images.push(file);
    BindInput.image_data.push(null);
    const index = BindInput.image_data.length - 1;
    FILES.sync_read(file ,(res) => {
      BindInput.image_data[index] = res;
    });
  }
}

function handleImageRemove(idx) {
  BindInput.images.splice(idx, 1);
  BindInput.image_data.splice(idx, 1);
}


///// files
function handleFileInput(event) {
  const files = event.target.files;
  for (let i = 0; i < files.length; i++)
    BindInput.files.push(files[i]);
}

function handleFileRemove(idx) {
  BindInput.files.splice(idx, 1);
}


///// update
function uploadModify() {

}

///// functions
function openModify() {
  BindInput.desc = BindData.desc;
  Status.modify = true;
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