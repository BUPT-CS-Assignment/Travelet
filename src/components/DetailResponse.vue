<template>
<div class="pa-2">
  <!-- from -->
  <div class="d-flex align-center">
    <v-avatar size="36" rounded="lg" color="grey">{{ Data.poster[0] }}</v-avatar>
    <p class="text-subtitle-1 font-weight-bold ml-3">{{ Data.poster }}</p>
    <p class="text-subtitle-2 font-weight-bold ml-auto"> {{ Data.date }}</p>
  </div>

  <!-- detail -->
  <div class="mt-2">
    <p>
      Data.desc
    </p>

    <!-- images -->
    <div v-if="props.modified" class="d-flex">
      <v-file-input ref="ImageInputRef"
        style="position: absolute;display: none;" accept="image/*"
        @change="(event) => handleFileInput(event, Data.images)"
        multiple
      />

      <v-btn color="blue-accent-2" @click="ImageInputRef.click()" 
        variant="flat" width="140" class="ml-auto"
      >
        添加图像  
      </v-btn>
    </div>
    <v-row class="mt-4">
      <v-col v-for="(item, index) in Data.images" cols="auto">
        <v-img :src="item.raw" aspect-ratio="1" cover min-width="160">
          <div v-if="props.modified" class="d-flex">
            <v-btn icon="" variant="text" color="red" size="small" class="ml-auto"
              @click="handleFileRemove(index, Data.images)"
            >
              <v-icon size="large">mdi-close</v-icon>
            </v-btn>
          </div>
        </v-img>
      </v-col>
    </v-row>

    <!-- files -->
    <div v-if="props.modified" class="d-flex">
      <v-file-input
        style="position: absolute;display: none;"
        ref="FileInputRef"
        @change="(event) => handleFileInput(event, Data.files)"
        multiple
      />

      <v-btn color="blue-accent-2" @click="FileInputRef.click()" 
        variant="flat" width="140" class="ml-auto"
      >
        添加其他文件
      </v-btn>
    </div>
    <v-list-item v-for="(file, index) in Data.files" :key="index"
      :title="file.name"
      :subtitle="formatFileSize(file.size)"
    >
      <template v-slot:prepend>
        <v-icon color="grey-darken-3">
          {{ iconFileType(file.type) }}
        </v-icon>
      </template>
      <template v-if="modified" v-slot:append>
        <v-btn icon="" variant="text" color="red" size="small"
          @click="handleFileRemove(index, Input.files)"
        >
          <v-icon size="large">mdi-close</v-icon>
        </v-btn>
      </template>
    </v-list-item>
  </div>

  <!-- modify -->
  <v-btn v-if="props.modified" color="blue-accent-2" @click="" 
    variant="flat" width="100%" class="mt-2"
  >
    保存修改
  </v-btn>
  
  <!-- accept -->
  <template v-if="props.acceptable">
    <div class="d-flex justify-end mt-2">
      <v-btn elevation="0" color="deep-orange" class="ml-2">
        <p class="text-subtitle-2 font-weight-bold">拒绝</p>
      </v-btn>
      <v-btn elevation="0" color="green" class="ml-2">
        <p class="text-subtitle-2 font-weight-bold">接受</p>
      </v-btn>
    </div>
  </template>
</div>

</template>

<script setup>
import { ref, reactive } from 'vue';
import {handleFileInput, handleFileRemove ,formatFileSize, iconFileType} from '@/plugins/files'

const props = defineProps({
  uid: {
    type: String,
    required: true
  },
  modified: {
    type: Boolean,
    default: false
  },
  acceptable: {
    type: Boolean,
    default: false
  }
})

const Data = reactive({
  poster: 'USER',
  date: '2023/12/11',
  desc: 'description',
  images: [],
  files: []
})

const ImageInputRef = ref(null);
const FileInputRef = ref(null);


</script>