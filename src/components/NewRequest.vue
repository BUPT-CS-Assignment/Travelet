<template>
<!-- post title -->
<v-card height="60" color="blue-accent-3" rounded="0" elevation="0"
  class="d-flex justify-center align-center"
>
  <p class="text-h6 font-weight-bold">
    发布新请求
  </p>
</v-card>
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
          ref="TagsInputRef" :tags="TagsPreset">
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
          @change="(event) => FILES.handleFileInput(event, Input.images, updateImage)"
          multiple
        />

        <v-btn color="blue-accent-3" @click="ImageInputRef.click()">
          添加图像  
        </v-btn>

        <v-row class="mt-4">
          <v-col v-for="(item, index) in Input.images" cols="auto">
            <v-img :src="Input.image_data[index]" aspect-ratio="1" cover width="200">
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
      </v-stepper-window-item>

      <!-- step 4 -->
      <v-stepper-window-item :value="4">
        <v-file-input
          style="position: absolute;display: none;"
          ref="FileInputRef"
          @change="(event) => FILES.handleFileInput(event, Input.files)"
          multiple
        />

        <v-btn color="blue-accent-3" @click="FileInputRef.click()">
          添加其他文件
        </v-btn>

        <v-list>
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
      </v-stepper-window-item>

    </v-stepper-window>

    <!-- actions -->
    <div class="d-flex mx-6 mb-6">
      <v-btn @click="prev" :disabled="Step == 1" variant="text" width="80">
        <p class="text-subtitle-1 font-weight-bold">上一步</p>
      </v-btn>
      <v-btn @click="props.onCancel" class="ml-auto mr-4" variant="text" color="red" width="80" :disabled="OnUploading">
        <p class="text-subtitle-1 font-weight-bold">取消</p>
      </v-btn>
      <template v-if="Step >= Steps.length">
        <v-btn @click="upload" variant="flat" width="80" color="blue-accent-3" :disabled="OnUploading">
          <p class="text-subtitle-1 font-weight-bold">
            {{ OnUploading ? '请稍后' : '发布' }}
          </p>
        </v-btn>
      </template>
      <template v-else>
        <v-btn @click="next" :disabled="!checkNext(Step)" variant="text" width="80">
          <p class="text-subtitle-1 font-weight-bold">下一步</p>
        </v-btn>
      </template>
      
    </div>

  </template>
</v-stepper>
</template>

<script setup>
import { ref, reactive } from 'vue';
import RegionSelect from '@/components/util/RegionSelect.vue';
import TagBar from '@/components/util/TagBar.vue';

import TagsPreset from '@/plugins/tags'
import * as FILES from '@/plugins/files'
import * as QUERY from '@/plugins/query'

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
  desc: 'Description',
  images: [],
  image_data: [],
  files: [],
})

const RegionSelectRef = ref(null);
const ImageInputRef = ref(null);
const FileInputRef = ref(null);
const TagsInputRef = ref(null);
const OnUploading = ref(false);

const Step = ref(1);
const Steps = ['Step1', 'Step2', 'Step3', 'Step4'];

function updateImage(idx, file) {
  Input.image_data.push(null);
  FILES.sync_read(file ,(res) => {
    Input.image_data[Input.image_data.length - 1] = res;
  });
}

function removeImage(idx) {
  Input.image_data.splice(idx, 1);
}

function checkNext(index) {
  switch (index) {
    case 1:
      return checkStep1();
    case 2:
      return checkStep2();
    default:
      return true;
  }
}

function checkStep1(){
  if(!RegionSelectRef.value) return false;
  return Input.brief.length > 0 && RegionSelectRef.value.isComplete();
}

function checkStep2(){
  return Input.desc.length > 0;
}


function upload() {
  if(!checkStep1() || !checkStep2()) {
    alert('请填写完整信息');
    return;
  }

  var formData = new FormData();
  // poster_id
  formData.append('poster_id', QUERY.get_user_id());
  // brief
  formData.append('title', Input.brief);
  // tags
  const tags = TagsInputRef.value.getData();
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    formData.append('tags', tag);
  }
  // desc
  formData.append('description', Input.desc);
  // region
  const city = RegionSelectRef.value.getString();
  formData.append('city', city);
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
  QUERY.post('/api/user/request/post', formData, null, false)
  .then(res => {
    alert('发布成功');
    props.onComplete();
  })
  .catch(err => {
    alert(err);
  })
}

</script>