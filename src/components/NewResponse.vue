<template>
  <!-- step 1 -->
  <div>
    <div class="d-flex flex-row">
      <p class="text-subtitle-1 font-weight-bold mb-2 ml-1">
        响应内容
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
      @change="(event) => handleFileInput(event, Input.images)"
      multiple
    />

    <v-row class="mt-4">
      <v-col v-for="(item, index) in Input.images" cols="auto">
        <v-img :src="item.raw" aspect-ratio="1" cover min-width="200">
          <div class="d-flex">
            <v-btn icon="" variant="text" color="red" size="small" class="ml-auto"
              @click="handleFileRemove(index, Input.images)"
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
      @change="(event) => handleFileInput(event, Input.files)"
      multiple
    />

    <v-list style="background: none;">
      <v-list-item v-for="(file, index) in Input.files" :key="index"
        :title="file.name"
        :subtitle="formatFileSize(file.size)"
      >
        <template v-slot:prepend>
          <v-icon color="grey-darken-3">
            {{ iconFileType(file.type) }}
          </v-icon>
        </template>
        <template v-slot:append>
          <v-btn icon="" variant="text" color="red" size="small"
            @click="handleFileRemove(index, Input.files)"
          >
            <v-icon size="large">mdi-close</v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>
  </div>

  <!-- actions -->
  <v-btn @click="props.onCancel" class="ml-auto mr-4" variant="text" color="red" width="80">
    <p class="text-subtitle-1 font-weight-bold">取消</p>
  </v-btn>

</template>

<script setup>
import { ref, reactive } from 'vue';

const props = defineProps({
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
  desc: 'Description',
  images: [],
  files: [],
})

const ImageInputRef = ref(null);
const FileInputRef = ref(null);


function handleFileInput(event, dest) {
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    var file = files[i];
    const reader = new FileReader();
    reader.onload = () => {
      file['raw'] = reader.result;
      dest.push(file);
    }
    reader.readAsDataURL(file);
  }
}

function handleFileRemove(idx, dest) {
  dest.splice(idx, 1);
}

function formatFileSize(size) {
  if (size === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const FileIconMap = {
  image: 'mdi-image',
  video: 'mdi-play-box',
  audio: 'mdi-music-box',
  text: 'mdi-text-box',
  application: 'mdi-file',
}

function iconFileType(ftype) {
  const t = String(ftype).split('/')[0];
  if(t in FileIconMap) return FileIconMap[t];
  else return 'mdi-file-question';
}

function upload() {
  const formData = new FormData();
  // desc
  formData.append('desc', Input.desc);
  formData.append('region', city);
  // images
  for (let i = 0; i < Input.images.length; i++) {
    const file = Input.images[i];
    formData.append('files[]', file);
  }
  // files
  for (let i = 0; i < Input.files.length; i++) {
    const file = Input.files[i];
    formData.append('files[]', file);
  }

}

</script>