<template>
<div class="pa-2" style="width: 100%;">
  <!-- header -->
  <div class="d-flex align-center">
    <!-- from -->
    <v-avatar size="40" rounded="lg" color="grey">
      {{ BindData.name.length > 0 ? BindData.name[0] : '' }}
    </v-avatar>
    <div class="d-flex flex-column justify-start align-start">
      <p class="text-subtitle-1 font-weight-bold ml-3">{{ BindData.name }}</p>
      <p class="text-caption text-grey-darken-2 ml-3"> {{ BindData.date }}</p>
    </div>
    
    <!-- buttons -->
    <template v-if="props.modified">
      <div class="ml-auto d-flex align-self-end">
        <template v-if="!Flags.update">
          <v-icon color="red" size="24" class="mr-4" @click="remove">
            mdi-trash-can-outline
          </v-icon>
          <v-icon size="24" class="mr-2" @click="modify">
            mdi-pencil-outline
          </v-icon>
        </template>
        <template v-else>
          <v-icon size="24" class="mr-4" @click="RefImageInput.click()">
            mdi-image-plus-outline
          </v-icon>
          <v-icon size="24" class="mr-2" @click="RefFileInput.click()">
            mdi-folder-plus-outline
          </v-icon>
        </template>
      </div>
    </template>
  </div>

  <!-- detail -->
  <div class="mt-2">
    <template v-if="!Flags.update">
      <p style="word-break: break-all;"> {{BindData.desc}} </p>
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
  
    <!-- images -->
    <template v-if="props.modified">
      <v-file-input ref="RefImageInput"
        style="position: absolute;display: none;" accept="image/*"
        @change="(event) => handleImageInput(event)"
        multiple
      />
    </template>
    <v-row class="mt-4">
      <!-- server images -->
      <v-col v-for="(item, index) in BindData.images" cols="auto">
        <v-img @click="RefImageAmp.url(item.id)"
          :src="QUERY.fileURL(item.id)" 
          aspect-ratio="1" min-width="160" cover 
          lazy-src="https://fakeimg.pl/300x300/?retina=1&text=image&font=lobster"
        >
          <div v-if="props.modified" class="d-flex">
            <v-btn @click="" icon="" variant="text" color="red" size="small" class="ml-auto">
              <v-icon size="large">mdi-close</v-icon>
            </v-btn>
          </div>
        </v-img>
      </v-col>
      <!-- local images -->
      <template v-if="props.modified">
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
      </template>
    </v-row>

    <!-- server files -->
    <v-list-item v-for="(file, index) in BindData.files" :key="index"
      :title="file.name"
      :subtitle="FILES.formatFileSize(file.size)"
    >
      <template v-slot:prepend>
        <v-icon color="grey-darken-3"> {{ FILES.iconFileType(file.type) }} </v-icon>
      </template>
      <template v-if="modified" v-slot:append>
        <v-btn @click="" icon="" variant="text" color="red" size="small">
          <v-icon size="large">mdi-close</v-icon>
        </v-btn>
      </template>
    </v-list-item>
    <!-- local files -->
    <template v-if="props.modified">
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
        <template v-if="modified" v-slot:append>
          <v-btn @click="handleFileRemove(index)" icon="" variant="text" color="red" size="small">
            <v-icon size="large">mdi-close</v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </template>
  </div>

  <!-- modify -->
  <template v-if="Flags.update">
    <div class="d-flex">
      <v-btn color="red" variant="outlined" class="ml-auto" elevation="0" 
        @click="cancel"
      >
        <p class="text-subtitle-1">取消</p>
      </v-btn>
      
      <v-btn color="blue-accent-3" class="align-self-start ml-2" elevation="0"
        :disabled="BindInput.desc.length == 0" 
        @click="upload"
      >
        <p class="text-subtitle-1">发布</p>
      </v-btn>
    </div>
  </template>
  
  <!-- accept -->
  <template v-if="props.acceptable">
    <div class="d-flex justify-end mt-2">
      <v-btn color="red" variant="outlined" class="ml-auto" elevation="0">
        <p class="text-subtitle-1">拒绝</p>
      </v-btn>
      <v-btn color="blue-accent-3" class="align-self-start ml-2" elevation="0">
        <p class="text-subtitle-1">接受</p>
      </v-btn>
    </div>
  </template>
</div>

<!-- Amplify -->
<image-amp ref="RefImageAmp"></image-amp>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import ImageAmp from '@/components/util/ImageAmp.vue';
import * as FILES from '@/plugins/files'
import * as QUERY from '@/plugins/query'

///// props
const props = defineProps({
  responder_id: {type: Number, default: null},
  response_id: { type:Number, default: null},
  request_id: { type:Number, default: null },
  modified: { type: Boolean, default: true },
  acceptable: { type: Boolean, default: true },
  modify_at_init: {type:Boolean, default: false},
  on_cancel: { type: Function, default: ()=>{} },
  on_delete: { type: Function, default: ()=>{} },
  on_success: { type: Function, default: ()=>{} }
})

///// ref
const RefImageAmp = ref(null);
const RefImageInput = ref(null);
const RefFileInput = ref(null);

///// v-model
const Flags = reactive({
  update: false
})
const BindInput = reactive({
  desc: '',
  images: [],
  files: [],
  image_data: []
})
const BindData = reactive({
  uid: NaN,
  name: '',
  date: '',
  desc: '',
  images: [],
  files: []
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


///// operations
// modify
function modify() {
  Flags.update = true;
}

// cancel
function cancel() {
  Flags.update = false;
  BindInput.desc = BindData.desc;
  props.on_cancel();
}

// upload
function upload() {
  const formData = new FormData();
  formData.append('description', BindInput.desc);
  formData.append('request_id', props.request_id);
  formData.append('responder_id', QUERY.get_user_id());
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
  // post to server
  QUERY.post('/api/user/response/post', formData, null, false)
  .then(res => {
    alert('发布成功')
    props.on_success();
  })
}

// delete current
function remove() {
  QUERY.post('/api/user/response/delete', {
    response_id: props.response_id
  })
  .then(data => {
    alert('删除成功');
    props.on_delete();
  })
}

// on init
function init_user(user_id) {
  if(user_id === QUERY.get_user_id()) {
    BindData.name = QUERY.get_username();
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

// init infomation
function init() {
  if(props.responder_id != null) init_user(props.responder_id);

  if(props.response_id == null || props.response_id == NaN || props.response_id == undefined)
    return;

  QUERY.get('/api/user/response/query_detail',{
    response_id : props.response_id
  })
  .then(data => {
    const info = data.data;
    console.log(info)

    if(!props.responder_id) {
      BindData.responder_id = info.responder_id;
      init_user(info.responder_id);
    }
    
    BindData.date = info.modify_time;
    BindData.desc = info.description;
    BindData.images = info.image_files;
    BindData.files = info.raw_files;
    // copy to input
    BindInput.desc = BindData.desc;
  })
}


///// mounted
onMounted(() => {
  init();
  if(props.modify_at_init) modify();
})


///// expose
defineExpose({

})
</script>