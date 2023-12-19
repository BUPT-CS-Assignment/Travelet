<template>
  <v-combobox :items="TagsPreset" v-model="tags"
    chips clearable multiple
    :variant="props.variant" rounded="lg" color="grey-darken-3"
    label="选择或输入关键词"
  >
    <template v-slot:prepend-inner>
      <v-btn :icon="props.icon" variant="text"
        color="grey"
        @click="props.action(tags)"
      />
    </template>
    <template v-slot:selection="{ attrs, item, select, selected }">
      <v-chip>{{ item }}</v-chip>
    </template>
  </v-combobox>
</template>

<script setup>
import {ref, onMounted} from 'vue';

const props = defineProps({
  tags: {
    type: Array,
    default: []
  },
  preset: {
    type: Array,
    default: []
  },
  icon: {
    type: String,
    default: 'mdi-magnify'
  },
  variant:{
    type:String,
    default: 'solo'
  },
  action: {
    type: Function,
    default: () => {}
  }
})

const TagsPreset = ref([]);
const tags = ref([]);

// on mounted
onMounted(() => {
  TagsPreset.value = props.tags;
  tags.value = props.preset;
})

// expose
defineExpose({
  getData: () => {
    return tags.value;
  }
})

</script>