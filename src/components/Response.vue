<template>
<div class="pa-2" style="width: 100%;">
  <!-- header -->
  <div class="d-flex">
    <!-- from -->
    <v-avatar size="40" rounded="lg" color="grey" class="align-self-center">
      {{ BindData.name.length > 0 ? BindData.name[0] : '' }}
    </v-avatar>
    <div class="d-flex flex-column justify-start align-start">
      <p class="text-subtitle-1 font-weight-bold ml-3">{{ BindData.name }}</p>
      <p class="text-caption text-grey-darken-2 ml-3"> {{ BindData.date }}</p>
    </div>
    <!-- my -->
    <v-chip v-if="USER_ID == RESPONDER" label color="blue" class="align-self-start ml-3">
      <v-icon size="small">mdi-account</v-icon>
      <p class="font-weight-bold ml-1">我的回复</p>
    </v-chip>
    <!-- accepted -->
    <v-chip v-if="BindData.status == 1" label color="green" class="align-self-start ml-3">
      <v-icon size="small">mdi-star</v-icon>
      <p class="font-weight-bold ml-1">已采纳</p>
    </v-chip>


    <!-- buttons -->
    <template v-if="props.modified">
      <div class="ml-auto d-flex align-self-end">
        <template v-if="!Status.update">
          <v-icon color="red" size="24" class="mr-4" @click="remove">
            mdi-trash-can-outline
          </v-icon>
          <v-icon size="24" class="mr-2" @click="openModify">
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
    <template v-if="!Status.update">
      <p  v-html="DescFormatted" style="word-break: break-all;"></p>
    </template>
    <template v-else>
      <v-textarea 
        :rules="[rules.required, rules.max]"
        counter
        rounded="lg"
        v-model="BindInput.desc"
        auto-grow
        hide-details
        variant="outlined"
        class="mb-2"
      />
    </template>
  
    <!-- images -->
    <v-row class="mt-4">
      <!-- server images -->
      <v-col v-for="(item, index) in BindData.images" cols="auto">
        <v-img @click="RefImageAmp.url(item.id)"
          :src="QUERY.fileURL(item.id)" 
          aspect-ratio="1" width="160" cover 
          lazy-src="https://fakeimg.pl/300x300/?retina=1&text=image&font=lobster"
        >
          <div v-if="Status.update" class="d-flex">
            <v-btn @click.stop="serverImageRemove(index)" icon="" variant="text" color="red" size="small" class="ml-auto">
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
            aspect-ratio="1" cover width="160"
          >
            <div v-if="Status.update" class="d-flex">
              <v-btn @click.stop="handleImageRemove(index)" icon="" variant="text" color="red" size="small" class="ml-auto">
                <v-icon size="large">mdi-close</v-icon>
              </v-btn>
            </div>
          </v-img>
        </v-col>
      </template>
    </v-row>

    <!-- server files -->
    <v-list-item v-for="(file, index) in BindData.files" :key="index"
      :title="file.filename"
      :subtitle="FILES.formatFileSize(file.size)"
      @click="QUERY.download(file.id)"
    >
      <template v-slot:prepend>
        <v-icon color="grey-darken-3"> {{ FILES.iconFileType(file.mime) }} </v-icon>
      </template>
      <template v-if="props.modified && Status.update" v-slot:append>
        <v-btn @click.stop="serverFileRemove(index)" icon="" variant="text" color="red" size="small">
          <v-icon size="large">mdi-close</v-icon>
        </v-btn>
      </template>
    </v-list-item>
    <!-- local files -->
    <template v-if="props.modified && Status.update">
      <v-list-item v-for="(file, index) in BindInput.files" :key="index"
        :title="file.name"
        :subtitle="FILES.formatFileSize(file.size)"
      >
        <template v-slot:prepend>
          <v-icon color="grey-darken-3"> {{ FILES.iconFileType(file.type) }} </v-icon>
        </template>
        <template v-slot:append>
          <v-btn @click.stop="handleFileRemove(index)" icon="" variant="text" color="red" size="small">
            <v-icon size="large">mdi-close</v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </template>
  </div>

  <!-- modify -->
  <template v-if="Status.update">
    <div class="d-flex">
      <v-btn color="red" variant="outlined" class="ml-auto" elevation="0" 
        @click="cancel"  :disabled="Status.uploading"
      >
        <p class="text-subtitle-1">取消</p>
      </v-btn>
      
      <template v-if="props.response_id == null">
        <v-btn color="blue-accent-3" class="align-self-start ml-2" elevation="0"
          :disabled="Status.uploading || !assert_desc" 
          @click="upload"
        >
          <p class="text-subtitle-1">{{ Status.uploading ? '请稍后' : '发布' }}</p>
        </v-btn>
      </template>
      <template v-else>
        <v-btn color="blue-accent-3" class="align-self-start ml-2" elevation="0"
          :disabled="Status.uploading || !assert_desc" 
          @click="uploadModify"
        >
          <p class="text-subtitle-1">{{ Status.uploading ? '请稍后' : '保存' }}</p>
        </v-btn>
      </template>
      
    </div>
  </template>
  
  <!-- accept -->
  <template v-if="props.acceptable && Status.loaded">
    <div class="d-flex justify-end mt-2">
      <template v-if="BindData.status == 0">
        <v-btn @click="reject" color="red" variant="outlined" class="ml-auto" elevation="0">
          <p class="text-subtitle-1">拒绝</p>
        </v-btn>
        <v-btn @click="accept" color="blue-accent-3" class="align-self-start ml-2" elevation="0">
          <p class="text-subtitle-1">采纳</p>
        </v-btn>
      </template>
      <template v-else-if="BindData.status == 2">
        <v-btn color="red" variant="outlined" class="ml-auto" elevation="0" disabled>
          <p class="text-subtitle-1">已拒绝</p>
        </v-btn>
      </template>

    </div>
  </template>
</div>

<!-- Amplify -->
<image-amp ref="RefImageAmp"></image-amp>
<Loading ref="RefLoading"></Loading>

<template v-if="props.modified">
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
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import ImageAmp from '@/components/util/ImageAmp.vue';
import Loading from './util/Loading.vue';
import * as FILES from '@/plugins/files'
import * as QUERY from '@/plugins/query'
import * as Events from '@/plugins/event'

///// props
const props = defineProps({
  responder_id: {type: Number, default: null},
  response_id: { type:Number, default: null},
  request_id: { type:Number, default: null },
  modified: { type: Boolean, default: false },
  acceptable: { type: Boolean, default: false },
  modify_at_init: {type:Boolean, default: false},
  on_cancel: { type: Function, default: ()=>{} },
  on_delete: { type: Function, default: ()=>{} },
  on_success: { type: Function, default: ()=>{} }
})

///// const value
const USER_ID = Number(QUERY.get_user_id());
const RESPONDER = ref(null);

///// ref
const RefImageAmp = ref(null);
const RefImageInput = ref(null);
const RefFileInput = ref(null);
const RefLoading = ref(null);

///// v-model
const Status = reactive({
  update: false,
  loaded: false,
  uploading: false
})
const BindInput = reactive({
  desc: '',
  images: [],
  files: [],
  image_data: [],
  deleted: []
})
const BindData = reactive({
  uid: NaN,
  name: '',
  date: '',
  desc: '',
  images: [],
  files: [],
  status: 0
})

///// rules
const rules = {
  required: (value) => !!value || '不能为空',
  max: (v) => v.length <= 800 || '不能超过800个字符',
}
const assert_desc = computed(() => {
  return rules.required(BindInput.desc) === true &&
         rules.max(BindInput.desc) === true;
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


///// operations
// action
function accept() {
  if(!confirm('确认采纳?')) return;
  RefLoading.value.show();
  QUERY.post('/api/user/request/reply',{
    request_id: props.request_id,
    response_id: props.response_id,
    action: "accept"
  })
  .then(data => {
    if(RefLoading.value) RefLoading.value.hide();
    Events.info('已采纳回复')
    window.location.reload();
  })
}

function reject() {
  if(!confirm('确认拒绝?')) return;
  RefLoading.value.show();
  QUERY.post('/api/user/request/reply',{
    request_id: props.request_id,
    response_id: props.response_id,
    action: "deny"
  })
  .then(data => {
    if(RefLoading.value) RefLoading.value.hide();
    Events.warn('已拒绝回复')
    window.location.reload();
  })
}

// modify
function openModify() {
  BindInput.desc = BindData.desc;
  BindInput.images = []
  BindInput.files = []
  BindInput.image_data = []
  BindInput.deleted = []
  Status.update = true;
}

function uploadModify() {
  if(props.response_id == null || props.response_id == NaN || props.response_id == undefined)
    return;

  if(!confirm('确认修改?')) return;

  Status.uploading = true;
  var formData = new FormData();
  formData.append('response_id', props.response_id);
  formData.append('description', BindInput.desc);
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

  QUERY.post('/api/user/response/modify', formData, null, false)
  .then(res => {
    Events.info('修改成功');
    init();
  })
}

// cancel
function cancel() {
  BindInput.desc = BindData.desc;
  BindInput.images = [];
  BindInput.files = [];
  BindInput.image_data = [];
  init();
  props.on_cancel();
  Status.update = false;
}

// upload
function upload() {
  if(!confirm('确认发布?')) return;
  Status.uploading = true;
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
    Status.uploading = false;
    Events.info('发布成功')
    props.on_success();
  })
}

// delete current
function remove() {
  if(!confirm('确认删除?')) return;
  QUERY.post('/api/user/response/delete', {
    response_id: props.response_id
  })
  .then(data => {
    Events.warn('删除成功');
    props.on_delete();
  })
}

// on init
function init_user(user_id) {
  RESPONDER.value = Number(user_id);
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

// init infomation
function init() {
  Status.update = false;
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
      RESPONDER.value = Number(info.responder_id);
      BindData.responder_id = info.responder_id;
      init_user(info.responder_id);
    }
    
    BindData.date = info.modify_time;
    BindData.desc = info.description;
    BindData.images = info.image_files;
    BindData.files = info.raw_files;
    BindData.status = info.status;
    // copy to input
    BindInput.desc = BindData.desc;

    Status.loaded = true;
  })
}


///// mounted
onMounted(() => {
  init();
  if(props.modify_at_init) openModify();
})

</script>