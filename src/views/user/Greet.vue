<template>
<div class="d-flex flex-column">
  <!-- title -->
  <p class=" text-h5 font-weight-black align-self-center">
    有朋自远方来
  </p>

  <p class="align-self-center text-body-2 text-grey-darken-2">
    {{ City }}
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
    <!-- header -->
    <div class="d-flex flex-row ml-auto">
      <!-- post new -->
  </div>


  <!-- post content -->
  <div class="my-2">
    <v-row>
      <v-col v-for="(value, key) in Posts" justify="center">
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

</template>

<script setup>
import {ref, reactive, onMounted} from 'vue';
import TagBar from '@/components/util/TagBar.vue'
import Poster from '@/components/poster/GreetPoster.vue';

import TagsPreset from '@/plugins/tags'
import * as QUERY from '@/plugins/query'

const PageLen = ref(1);
const CurPage = ref(1);

const City = ref('')

const Posts = reactive({})

function doSearch(tags = null){
  Object.keys(Posts).forEach(key => {
    delete Posts[key];
  })
  let params = {
    page : CurPage.value,
    city: City.value,
    is_responder: 1,
  }
  if(tags != null) {
    params.str = tags.join(' ');
  }
  QUERY.get('/api/user/request/query_brief', params, 'poster_id')
  .then(data => {
    console.log(data)
    PageLen.value = data.total_pages;
    data.data.forEach(element => {
      Posts[element.id] = element
    });
  }) 
}

onMounted(() => {
  QUERY.get('/api/user/info', {}, 'user_id')
  .then(data => {
    City.value = data.data.register_city;
    doSearch();
  })
})


</script>