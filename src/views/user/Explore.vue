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
<v-dialog 
  min-width="400"
  max-width="800"
  persistent
  transition="dialog-bottom-transition"
  v-model="Dialog"
> 
  <NewPost min-width="640" max-width="800"
    :onCancel="()=>{Dialog=false;}"
    :onComplete="()=>{Dialog=false;}"
  ></NewPost>
</v-dialog>
</template>

<script setup>
import {ref, reactive} from 'vue';
import { useRouter } from 'vue-router';

import TagBar from '@/components/TagBar.vue'
import Poster from '@/components/RequestPoster.vue';
import NewPost from '@/components/NewPost.vue'
import TagsPreset from '@/plugins/tags'
import { onMounted } from 'vue';
import * as QUERY from '@/plugins/query'

const Router = useRouter();

const PageLen = ref(1);
const CurPage = ref(1);
const Dialog = ref(false);


const search_open = ref(false)

function onTagChange(val) {
  console.log(val)
}

onMounted(() => {
  QUERY.get('/api/user/request/query', )
})


</script>