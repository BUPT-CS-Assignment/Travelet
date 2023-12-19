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
      @click="Dialog=true;"
    />

    <p class=" text-h5 font-weight-black align-self-center">
      探索世界
    </p>
    
  </div>
  
  
  <p class="align-self-center text-caption text-grey-darken-2">
    Page {{ CurPage }} / {{ PageLen }}
  </p>
  
  <!-- search bar -->
  <div style="min-width: 400px; max-width: 600px;" class="align-self-center">
    <v-divider class="my-6" />
    <TagBar class="align-self-center mb-4" style="height: 90px;"
      :tags="TagsPreset"
      :action="doSearch"
    />
  </div>

  <v-spacer class="my-2"></v-spacer>

  <!-- post content -->
  <div class="my-2">
    <v-row>
      <v-col v-for="(value, key) in Posts" class="ma-2">
        <poster :id="Number(key)" :data="value"/>
      </v-col>
    </v-row>
  </div>
  

  <!-- page navigation -->
  <v-pagination 
    v-model="CurPage"
    :length="PageLen"
  />
</div>
<v-dialog style="backdrop-filter: blur(10px);"
  min-width="400"
  max-width="800"
  persistent
  transition="dialog-bottom-transition"
  v-model="Dialog"
> 
  <new-request
    :onCancel="()=>{Dialog=false;}"
    :onComplete="()=>{Dialog=false; refresh();}"
  ></new-request>
</v-dialog>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue';
import { useRouter } from 'vue-router';
import TagBar from '@/components/util/TagBar.vue'
import Poster from '@/components/poster/ExplorePoster.vue';
import NewRequest from '@/components/NewRequest.vue'

import TagsPreset from '@/plugins/tags'
import * as QUERY from '@/plugins/query'

const Router = useRouter();

const PageLen = ref(1);
const CurPage = ref(1);
const Dialog = ref(false);

const Posts = reactive({})

function doSearch(tags){
  Object.keys(Posts).forEach(key => {
    delete Posts[key];
  })
  QUERY.get('/api/user/request/query_brief', {
    page : CurPage.value,
    str : tags.join(' '),
  }, 'poster_id')
  .then(data => {
    console.log(data)
    data.data.forEach(element => {
      Posts[element.id] = element
    });
  }) 
}

function refresh() {
  QUERY.get('/api/user/request/query_brief', {
    page : 1,
  }, 'poster_id')
  .then(data => {
    console.log(data)
    data.data.forEach(element => {
      Posts[element.id] = element
    });
  }) 
}

onMounted(() => {
  refresh();
})


</script>