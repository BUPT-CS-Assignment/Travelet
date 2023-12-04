<template>
<v-card height="100%" rounded="lg" class="pa-4">
  <v-card-title class="font-weight-bold">
    发布新请求
  </v-card-title>

    <v-text-field
      v-model="Input.brief"
      label="简述"
      outlined
      dense
      class="mb-2"
    />

    <RegionSelect></RegionSelect>
    
    <TagBar icon="mdi-tag-multiple-outline"
      :tags="TagsPreset">
    </TagBar>

    <v-textarea
      v-model="Input.desc"
      label="描述"
      outlined
      dense
      class="mb-2"
    />
    <v-file-input
      ref="FileInputRef"
      v-model="Input.files"
      counter
      label="File input"
      multiple
      placeholder="Select your files"
      prepend-icon="mdi-paperclip"
      variant="outlined"
      :show-size="1000"
    >
      <template v-slot:selection="{ fileNames }">
        <template v-for="(fileName, index) in fileNames" :key="fileName">
          <v-chip
            v-if="index < 2"
            color="blue-accent-2"
            label
            size="small"
            class="me-2"
          >
            {{ fileName }}
          </v-chip>

          <span
            v-else-if="index === 2"
            class="text-overline text-grey-darken-3 mx-2"
          >
            +{{ Input.files.length - 2 }} File(s)
          </span>
        </template>
      </template>
    </v-file-input>
    <v-btn @click="openFileInput">Add Image</v-btn>

  
</v-card>
</template>

<script setup>
import { ref, reactive } from 'vue';
import RegionSelect from './RegionSelect.vue';
import TagBar from './TagBar.vue';
import TagsPreset from '@/plugins/tags'

const Input = reactive({
  brief: 'Brief',
  tags: [],
  desc: 'Description',
  files: [],
})

const FileInputRef = ref(null);

const openFileInput = () => {
  FileInputRef.value.click();
}

</script>