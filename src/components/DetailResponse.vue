<template>
<div class="pa-2">
  <!-- from -->
  <div class="d-flex align-center">
    <v-avatar size="40" rounded="lg" color="grey">{{ Data.poster[0] }}</v-avatar>
    <div class="d-flex flex-column justify-start align-start">
      <p class="text-subtitle-1 font-weight-bold ml-3">{{ Data.poster }}</p>
      <p class="text-caption text-grey-darken-2 ml-3"> {{ Data.date }}</p>
    </div>
    
    <!-- buttons -->
    <template v-if="props.modified">
      <div class="ml-auto d-flex align-self-end">
        <template v-if="Update">
          <v-icon size="24" class="mr-4" @click="ImageInputRef.click()">
            mdi-image-plus-outline
          </v-icon>
          <v-icon size="24" class="mr-2" @click="FileInputRef.click()">
            mdi-folder-plus-outline
          </v-icon>
        </template>
        <template v-else>
          <v-icon color="red" size="24" class="mr-4" @click="">
            mdi-trash-can-outline
          </v-icon>
          <v-icon size="24" class="mr-2" @click="Update = true">
            mdi-pencil-outline
          </v-icon>
        </template>
      </div>
    </template>
    
  </div>

  <!-- detail -->
  <div class="mt-2">
    <template v-if="!Update">
      <p> {{Data.desc}} </p>
    </template>
    <template v-else>
      <v-textarea 
        rounded="lg"
        v-model="Input"
        auto-grow
        hide-details
        variant="outlined"
        class="mb-2"
      />
    </template>
    

    <!-- images -->
    <div v-if="props.modified" class="d-flex">
      <v-file-input ref="ImageInputRef"
        style="position: absolute;display: none;" accept="image/*"
        @change="(event) => handleFileInput(event, Data.images)"
        multiple
      />
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
        @change="(event) => FILES.handleFileInput(event, Data.files)"
        multiple
      />
    </div>
    <v-list-item v-for="(file, index) in Data.files" :key="index"
      :title="file.name"
      :subtitle="FILES.formatFileSize(file.size)"
    >
      <template v-slot:prepend>
        <v-icon color="grey-darken-3">
          {{ FILES.iconFileType(file.type) }}
        </v-icon>
      </template>
      <template v-if="modified" v-slot:append>
        <v-btn icon="" variant="text" color="red" size="small"
          @click="FILES.handleFileRemove(index, Input.files)"
        >
          <v-icon size="large">mdi-close</v-icon>
        </v-btn>
      </template>
    </v-list-item>
  </div>

  <!-- modify -->
  <template v-if="Update">
    <div class="d-flex">
      <v-btn color="red" variant="outlined" class="ml-auto" elevation="0" @click="cancel">
        <p class="text-subtitle-1">取消</p>
      </v-btn>
      <v-btn color="blue-accent-3" class="align-self-start ml-2" elevation="0"
        :disabled="Input.length == 0" @click="upload">
        <p class="text-subtitle-1">发布</p>
      </v-btn>
    </div>
  </template>

  
  <!-- accept -->
  <template v-if="props.acceptable">
    <div class="d-flex justify-end mt-2">
      <v-btn elevation="0" color="deep-orange" class="ml-2">
        <p class="text-subtitle-2 font-weight-bold">拒绝</p>
      </v-btn>
      <v-btn elevation="0" color="blue-accent-3" class="ml-2">
        <p class="text-subtitle-2 font-weight-bold">接受</p>
      </v-btn>
    </div>
  </template>
</div>

</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import * as FILES from '@/plugins/files'
import * as QUERY from '@/plugins/query'

const props = defineProps({
  uid: {
    type: Number,
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

const Update = ref(false);

const Input = ref('')

const Data = reactive({
  poster: 'USER',
  date: '2023/12/11',
  desc: 'description',
  images: [],
  files: []
})

const ImageInputRef = ref(null);
const FileInputRef = ref(null);

function cancel() {
  Update.value = false
  Input.value = Data.desc
}

onMounted(() => {

})
</script>