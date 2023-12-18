<template>
  <!-- step 1 -->
  <div>
    <div class="d-flex flex-row">
      <p class="text-subtitle-1 font-weight-bold mb-2 ml-1">
        发布新响应
      </p>
      <v-icon size="24" class="ml-auto mr-4" @click="ImageInputRef.click()">
        mdi-image-plus-outline
      </v-icon>
      <v-icon size="24" class="mr-2" @click="FileInputRef.click()">
        mdi-folder-plus-outline
      </v-icon>
    </div>
    
    <v-textarea
      v-model="Input.desc"
      auto-grow
      variant="outlined"
      dense
      class="mb-2"
    />
  </div>
  
  <!-- step 3 -->
  <div>
    <v-file-input ref="ImageInputRef"
      style="position: absolute;display: none;" accept="image/*"
      @change="(event) => FILES.handleFileInput(event, Input.images, updateImage)"
      multiple
    />

    <v-row v-if="Input.images.length > 0" class="mt-4">
      <v-col v-for="(item, index) in Input.images" cols="auto">
        <v-img :src="Input.image_data[index]" aspect-ratio="1" cover min-width="200">
          <div class="d-flex">
            <v-btn icon="" variant="text" color="red" size="small" class="ml-auto"
              @click="FILES.handleFileRemove(index, Input.images, removeImage)"
            >
              <v-icon size="large">mdi-close</v-icon>
            </v-btn>
          </div>
        </v-img>
      </v-col>
    </v-row>    
  </div>

  <!-- step 4 -->
  <div>
    <v-file-input
      style="position: absolute;display: none;"
      ref="FileInputRef"
      @change="(event) => FILES.handleFileInput(event, Input.files)"
      multiple
    />

    <v-list v-if="Input.files.length > 0" style="background: none;">
      <v-list-item v-for="(file, index) in Input.files" :key="index"
        :title="file.name"
        :subtitle="FILES.formatFileSize(file.size)"
      >
        <template v-slot:prepend>
          <v-icon color="grey-darken-3">
            {{ FILES.iconFileType(file.type) }}
          </v-icon>
        </template>
        <template v-slot:append>
          <v-btn icon="" variant="text" color="red" size="small"
            @click="FILES.handleFileRemove(index, Input.files)"
          >
            <v-icon size="large">mdi-close</v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>
  </div>

  <!-- actions -->
  <div class="d-flex">
    <v-btn color="red" variant="outlined" class="ml-auto" elevation="0" @click="props.onCancel">
      <p class="text-subtitle-1">取消</p>
    </v-btn>
    <v-btn color="blue-accent-3" class="align-self-start ml-2" elevation="0"
      :disabled="!Input.desc.length > 0" @click="upload">
      <p class="text-subtitle-1">发布</p>
    </v-btn>
  </div>


</template>

<script setup>
import { ref, reactive } from 'vue';
import * as FILES from '@/plugins/files'
import * as QUERY from '@/plugins/query'

const props = defineProps({
  request: {
    type: String,
    required: true,
  },
  onCancel: {
    type: Function,
    default: () => {},
  },
  onComplete: {
    type: Function,
    default: () => {},
  },
})

const Input = reactive({
  desc: '',
  images: [],
  files: [],
  image_data: [],
})

const ImageInputRef = ref(null);
const FileInputRef = ref(null);

function updateImage(idx, file) {
  Input.image_data.push(null);
  FILES.sync_read(file ,(res) => {
    Input.image_data[Input.image_data.length - 1] = res;
  });
}

function removeImage(idx) {
  Input.image_data.splice(idx, 1);
}



function upload() {
  const formData = new FormData();
  // desc
  formData.append('description', Input.desc);
  // request id
  formData.append('request_id', props.request);
  // responder
  formData.append('responder_id', QUERY.get_user_id());
  // images
  for (let i = 0; i < Input.images.length; i++) {
    const file = Input.images[i];
    formData.append('image_files', file);
  }
  // files
  for (let i = 0; i < Input.files.length; i++) {
    const file = Input.files[i];
    formData.append('raw_files', file);
  }

  // post
  QUERY.post('/api/user/response/post', formData, null, false)
  .then(res => {
    if(res.status == 0) {
      alert('发布成功');
      props.onComplete();
    } else {
      alert(res.message)
    }
  })
}

</script>