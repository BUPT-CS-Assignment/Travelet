<template>
<!-- post button -->
<v-btn height="60" color="blue-accent-3" rounded="0" elevation="0"
  @click="props.onClick"
>
  <p class="text-h6 font-weight-bold">
    发布
  </p>
</v-btn>

<!-- stepper -->
<v-stepper rounded="0" v-model="Step">
  <template v-slot:default="{prev, next}">
    <!-- header -->
    <v-stepper-header>
      <template v-for="(item, index) in Steps" :key="index">
        <v-stepper-item
          :complete="Step > index + 1"
          :step="item"
          :title="item"
          :value="index + 1"
        ></v-stepper-item>
        <v-divider
          v-if="index !== Steps.length - 1"
          :key="index"
        ></v-divider>
      </template>
    </v-stepper-header>
    
    <v-stepper-window>
      <!-- step 1-->
      <v-stepper-window-item :value="1">
        <p class="text-subtitle-1 font-weight-bold mb-2 ml-1">
          简述想法
        </p>
        
        <v-text-field
          v-model="Input.brief"
          variant="outlined"
          dense
          class="mb-2"
        />

        <p class="text-subtitle-1 font-weight-bold mb-2 ml-1">
          选择目的地
        </p>
        <RegionSelect ref="RegionSelectRef"></RegionSelect>
      </v-stepper-window-item>
      
      <!-- step 2 -->
      <v-stepper-window-item :value="2">
        <p class="text-subtitle-1 font-weight-bold mb-2 ml-1">
          探索标签
        </p>
        <TagBar icon="mdi-tag-multiple-outline" variant="outlined"
          :tags="TagsPreset">
        </TagBar>

        <p class="text-subtitle-1 font-weight-bold mb-2 ml-1">
          详细描述
        </p>
        <v-textarea
          v-model="Input.desc"
          variant="outlined"
          dense
          class="mb-2"
        />
      </v-stepper-window-item>
      
      <!-- step 3 -->
      <v-stepper-window-item :value="3">
        <v-file-input ref="ImageInputRef"
          style="position: absolute;display: none;" accept="image/*"
          @change="(event) => handleFileInput(event, Input.images)"
          multiple
        />

        <v-btn color="blue-accent-3" @click="ImageInputRef.click()">
          添加图像  
        </v-btn>

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
      </v-stepper-window-item>

      <!-- step 4 -->
      <v-stepper-window-item :value="4">
        <v-file-input
          style="position: absolute;display: none;"
          ref="FileInputRef"
          @change="(event) => handleFileInput(event, Input.files)"
          multiple
        />

        <v-btn color="blue-accent-3" @click="FileInputRef.click()">
          添加其他文件
        </v-btn>

        <v-list>
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
      </v-stepper-window-item>

    </v-stepper-window>

    <!-- actions -->
    <div class="d-flex mx-6 mb-6">
      <v-btn @click="prev" :disabled="Step == 1" variant="text" width="80">
        <p class="text-subtitle-1 font-weight-bold">上一步</p>
      </v-btn>
      <v-btn @click="props.onCancel" class="ml-auto mr-4" variant="text" color="red" width="80">
        <p class="text-subtitle-1 font-weight-bold">取消</p>
      </v-btn>
      <v-btn @click="next" :disabled="Step == Steps.length" variant="text" width="80">
        <p class="text-subtitle-1 font-weight-bold">下一步</p>
      </v-btn>
    </div>

  </template>
</v-stepper>
</template>

<script setup>
import { ref, reactive } from 'vue';
import RegionSelect from './RegionSelect.vue';
import TagBar from './TagBar.vue';
import TagsPreset from '@/plugins/tags'
import {handleFileInput, handleFileRemove ,formatFileSize, iconFileType} from '@/plugins/files'

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
  brief: 'Brief',
  tags: [],
  desc: 'Description',
  images: [],
  files: [],
})

const RegionSelectRef = ref(null);
const ImageInputRef = ref(null);
const FileInputRef = ref(null);

const Step = ref(1);
const Steps = ['Step1', 'Step2', 'Step3', 'Step4'];

function upload() {
  const formData = new FormData();
  // brief
  formData.append('brief', Input.brief);
  // tags
  for (let i = 0; i < Input.tags.length; i++) {
    const tag = Input.tags[i];
    formData.append('tags[]', tag);
  }
  // desc
  formData.append('desc', Input.desc);
  // region
  const region = RegionSelectRef.value.getString();
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