<template>
<div class="d-flex justify-center">
  <div class="d-flex flex-column py-2" style="width: 800px;max-width: 800px;">
    <!-- status & location -->
    <div class="d-flex flex-row mb-3 align-center">
      <v-chip label variant="flat" :color="StatusString[BindData.status].color">
        {{ StatusString[BindData.status].text }}
      </v-chip>

      <v-chip v-if="Status.loaded" class="ml-3 font-weight-bold" label color="grey-darken-2">
        {{ BindData.location }}
      </v-chip>

      <template v-if="Status.loaded && checkIsPoster">
        <template v-if="!Status.modify">
          <v-chip v-if="BindData.status == 0" class="ml-3 font-weight-bold"  label color="blue-accent-3" @click="openModify">
            修改
          </v-chip>
          <v-chip v-if="BindData.status == 3" class="ml-3 font-weight-bold"  label color="blue-accent-3" @click="repost">
            重新发布
          </v-chip>
          <v-chip v-if="BindData.status == 0 || BindData.status == 3" class="ml-3 font-weight-bold" label color="red" @click="remove">
            删除
          </v-chip>
        </template>
      </template>
    </div>

    <!-- title -->
    <p class="text-h3 font-weight-bold mt-4" style="word-break: break-all;"> {{ BindData.biref }} </p>
    <v-divider class="my-3"/>

    <!-- poster -->
    <div class="d-flex align-center" v-if="Status.loaded">
      <!-- from -->
      <v-avatar size="40" rounded="lg" color="grey">
        {{ BindData.name.length > 0 ? BindData.name[0] : '' }}
      </v-avatar>
      <div class="d-flex flex-column justify-start align-start">
        <p class="text-subtitle-1 font-weight-bold ml-3">{{ BindData.name }}</p>
        <p class="text-caption text-grey-darken-2 ml-3">发布于 {{ BindData.create_time }}</p>
      </div>

      <template v-if="Status.loaded && checkIsPoster && BindData.status == 0">
        <template v-if="Status.modify">
          <v-icon size="24" class="ml-auto mr-4" @click="RefImageInput.click()">
            mdi-image-plus-outline
          </v-icon>
          <v-icon size="24" class="mr-2" @click="RefFileInput.click()">
            mdi-folder-plus-outline
          </v-icon>
        </template>
      </template>
    </div>

    <!-- desc -->
    <template v-if="!Status.modify">
      <!-- tags -->
      <div class="d-flex flex-row flex-wrap mt-2">
        <template v-for="(tag, index) in BindData.tags">
          <p class="mr-2 text-body-2 font-weight-bold">
            <strong class="text-blue-accent-3">#</strong>
            {{ tag }}
          </p>
        </template>
      </div>
      <div class="mt-2">
        <p v-html="DescFormatted" style="word-break: break-all;"></p>
      </div>
    </template>
    <template v-else>
      <tag-bar ref="RefTagInput" class="mt-2"
        :tags="TagsPreset" 
        :preset="BindData.tags" 
        icon="mdi-tag-multiple-outline"
      />
      <v-textarea 
        rounded="lg"
        v-model="BindInput.desc"
        auto-grow
        hide-details
        variant="outlined"
        class="mb-2"
      />
    </template>

    <!-- images -->
    <template v-if="!Status.modify">
      <div class="flex-grow-1 mx-auto mt-4" style="width: 100%;" >
        <v-carousel v-if="BindData.images.length > 0"
          height="360" show-arrows="hover" style="border-radius: 10px;"
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
            aspect-ratio="1" width="160" cover 
            lazy-src="https://fakeimg.pl/300x300/?retina=1&text=image&font=lobster"
          >
            <div class="d-flex">
              <v-btn @click.stop="serverImageRemove(index)" icon="" variant="text" color="red" size="small" class="ml-auto">
                <v-icon size="large">mdi-close</v-icon>
              </v-btn>
            </div>
          </v-img>
        </v-col>
        <!-- local images -->
        <v-col v-for="(item, index) in BindInput.images" cols="auto">
          <v-img @click="RefImageAmp.raw(BindInput.image_data[index])"
            :src="BindInput.image_data[index]" 
            aspect-ratio="1" cover width="160"
          >
            <div class="d-flex">
              <v-btn @click.stop="handleImageRemove(index)" icon="" variant="text" color="red" size="small" class="ml-auto">
                <v-icon size="large">mdi-close</v-icon>
              </v-btn>
            </div>
          </v-img>
        </v-col>
      </v-row>
    </template>

    <v-spacer class="my-6"></v-spacer>
    <!-- files -->
    <div rounded="lg" clss="mx-2">
      <!-- server files -->
      <v-list-item v-for="(file, index) in BindData.files" :key="index"
        :title="file.filename"
        :subtitle="FILES.formatFileSize(file.size)"
      >
        <template v-slot:prepend>
          <v-icon color="grey-darken-3"> {{ FILES.iconFileType(file.mime) }} </v-icon>
        </template>
        <template v-if="Status.modify" v-slot:append>
          <v-btn @click="serverFileRemove(index)" icon="" variant="text" color="red" size="small">
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

    <template v-if="Status.modify">
      <div class="d-flex my-2" v-if="Status.loaded">
        <v-btn color="red" variant="outlined" class="ml-auto" elevation="0" 
          @click="Status.modify = false"
        >
          <p class="text-subtitle-1">取消</p>
        </v-btn>
        <v-btn color="blue-accent-3" class="align-self-start ml-2" elevation="0"
          :disabled="BindInput.desc.length == 0" 
          @click="uploadModify"
        >
          <p class="text-subtitle-1">保存</p>
        </v-btn>
      </div>
    </template>
    <template v-else-if="Status.loaded">
      <p class="text-subtitle-2 ml-auto mr-2 mt-4 text-grey">
        最后修改于: {{ BindData.modify_time }}
      </p>
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
  image_data: [],
  deleted: []
})

const BindData = reactive({
  poster_id: NaN,
  name: '',
  location: '',
  tags: [],
  create_time: '',
  modify_time: '',
  biref: '',
  desc: '',
  status: 4,
  images: [],
  files: [],
})

///// rules
const checkIsPoster = computed(() => {
  return USER_ID == BindData.poster_id;
})

///// text
const DescFormatted = computed(() => {
  return String(BindData.desc).replace(/\n/g, '<br/>');
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

function serverImageRemove(idx) {
  BindInput.deleted.push(BindData.images[idx].id);
  BindData.images.splice(idx, 1);
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

function serverFileRemove(idx) {
  BindInput.deleted.push(BindData.files[idx].id);
  BindData.files.splice(idx, 1);
}

///// delete current
function remove() {
  QUERY.post('/api/user/request/delete', {
    request_id: REQUEST_ID
  })
  .then(data => {
    alert('删除成功');
    BindData.status = 2;
  })
}

function repost() {
  QUERY.post('/api/user/request/repost', {
    request_id: REQUEST_ID
  })
  .then(data => {
    alert('发布成功');
    init();
  })
}

///// update
function openModify() {
  BindInput.desc = BindData.desc;
  BindInput.images = [];
  BindInput.files = [];
  BindInput.image_data = [];
  BindInput.deleted = [];
  Status.modify = true;
}

function uploadModify() {
  var formData = new FormData();
  formData.append('request_id', REQUEST_ID);
  formData.append('title', BindData.biref);
  formData.append('description', BindInput.desc);
  // tags
  const tags = RefTagInput.value.getData();
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    formData.append('tags', tag);
  }
  // images
  for (let i = 0; i < BindInput.images.length; i++) {
    const file = BindInput.images[i];
    formData.append('image_files', file);
  }
  // files
  for (let i = 0; i < BindInput.files.length; i++) {
    const file = BindInput.files[i];
    formData.append('raw_files', file);
  }
  // deleted
  BindInput.deleted.forEach(id => {
    formData.append('files_deleted', id);
  })

  QUERY.post('/api/user/request/modify', formData, null, false)
  .then(res => {
    alert('修改成功');
    window.location.reload();
  })
}

// on init
function init_user(user_id) {
  if(user_id === QUERY.get_user_id()) {
    BindData.name = QUERY.get_user_name();
    return;
  }

  QUERY.get('/api/user/info', {
    'user_id' : user_id
  })
  .then(data => {
    const basic = data.data;
    BindData.name = basic.username;
  })
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

    init_user(BindData.poster_id);
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