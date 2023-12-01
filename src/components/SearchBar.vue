<template>
  <v-combobox :items="TagsPreset" v-model="tags"
    chips clearable multiple
    variant="solo" rounded="lg" color="grey-darken-3"
    label="选择或输入关键词"
  >
    <template v-slot:prepend-inner>
      <v-btn icon="mdi-magnify" variant="text"
        color="grey"
        @click="props.action"
      />
    </template>
    <template v-slot:selection="{ attrs, item, select, selected }">
      <v-chip>{{ item }}</v-chip>
    </template>
  </v-combobox>
</template>

<script setup>
import {ref, onMounted, watch, toRaw} from 'vue';

const props = defineProps({
  tags: {
    type: Array,
    default: []
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
})

</script>