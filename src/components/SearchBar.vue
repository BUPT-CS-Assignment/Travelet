<template>
<v-combobox fluid :items="TagsPreset" v-model="tags"
    prepend-icon="mdi-filter-variant"
    chips clearable multiple
    variant="underlined" rounded="lg"
    label="选择或输入关键词" color="grey-darken-3"
  >
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
  watch: {
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

// on tags change
watch(tags, (val) => {
  props.watch(toRaw(val))
})

</script>