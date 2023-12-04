<template>
<div class="d-flex flex-column">

  <!-- title -->
  <div class="align-self-center d-flex justify-center"
    style="position: relative; width: 200px;"
  >
    <v-btn style="position: absolute; right: 10px; bottom: 2px;"
      color="blue-accent-3" elevation="0"
      size="small" density="comfortable"
      icon="mdi-plus"
    />

    <p class=" text-h5 font-weight-black align-self-center">
      探索 世界
    </p>
    
  </div>
  
  
  <p class="align-self-center text-caption text-grey-darken-2">
    Page {{ CurPage }} / {{ PageLen }}
  </p>
  
  <!-- search bar -->
  <div style="min-width: 400px; max-width: 600px;" class="align-self-center">
    <v-divider class="my-6" />
    <SearchBar class="align-self-center mb-4" style="height: 90px;"
      :tags="TagsPreset"
    />
  </div>

  <v-spacer class="my-2"></v-spacer>
  <!-- header -->
  <div class="d-flex flex-row ml-auto">
    <!-- post new -->
    

  </div>


  <!-- post content -->
  <div class="my-2">
    <v-row>
      <v-col v-for="(item, index) in 8" class="ma-2">
        <poster />
      </v-col>
    </v-row>
  </div>
  

  <!-- page navigation -->
  <v-pagination 
    v-model="CurPage"
    :length="PageLen"
  />
</div>
</template>

<script setup>
import {ref, reactive} from 'vue';
import SearchBar from '@/components/SearchBar.vue'
import Poster from '@/components/RequestPoster.vue';

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