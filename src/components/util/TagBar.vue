<template>
  <v-combobox :items="TagsPreset" v-model="tags"
    chips clearable multiple
    :variant="props.variant" rounded="lg" color="grey-darken-3"
    label="选择或输入关键词"
  >
    <template v-slot:prepend-inner>
      <v-btn :icon="props.icon" variant="text"
        color="grey"
        @click.stop="props.action(tags)"
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

// set default
function setData(data) {
  tags.value = data;
}

// on mounted
onMounted(() => {
  TagsPreset.value = props.tags;
})

// expose
defineExpose({
  getData: () => {
    return tags.value;
  },
  setData
})

</script>