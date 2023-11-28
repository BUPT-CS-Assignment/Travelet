<template>
<v-container class="d-flex flex-column">
  <!-- header -->
  <div class="d-flex flex-row ml-auto">
    <!-- post new -->
    <v-btn :disabled="search_open"
      color="blue-accent-3" class="mx-1"
      rounded="lg" elevation="0"
      append-icon="mdi-plus"
    >
    <p class="text-body-1">发布</p>
    </v-btn>

    <!-- searching -->
    <v-btn @click="search_open = !search_open; tags = []"
      color="green-lighten-1" class="mx-1"
      rounded="lg" elevation="0"
      :append-icon="search_open ? 'mdi-close' : 'mdi-magnify'"
    >
      <p class="text-body-1">搜索</p>
    </v-btn>
  </div>

  <!-- search bar -->
  <div v-if="search_open" class="my-2">
    <SearchBar :tags="TagsPreset" :watch="onTagChange"></SearchBar>
  </div>

  <!-- post content -->
  <v-container>
    <v-row>
      <v-col v-for="(item, index) in 8">
        <poster type="region"/>
      </v-col>
    </v-row>
  </v-container>
  

  <!-- page navigation -->
  <v-pagination 
    v-model="CurPage"
    :length="PageLen"
  />
</v-container>
</template>

<script setup>
import {ref, reactive} from 'vue';
import SearchBar from '@/components/SearchBar.vue'
import Poster from '@/components/Poster.vue';

const PageLen = ref(1);
const CurPage = ref(1);

const TagsPreset = [
  '钓鱼','老少皆宜','休闲','农家院','温泉度假','僻静休闲','游乐场'
]
const search_open = ref(false)

function onTagChange(val) {
  console.log(val)
}


</script>