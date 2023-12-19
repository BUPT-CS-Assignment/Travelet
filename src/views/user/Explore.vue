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
  
  <p class="align-self-center text-caption text-grey-darken-2 mt-2">
    第 {{ PageVal }} 页 / 共 {{ PageLen }} 页
  </p>
  
  
  <!-- search bar -->
  <div style="min-width: 400px; max-width: 600px;" class="align-self-center">
    <v-divider class="my-6" />
    <TagBar class="align-self-center mb-4" style="height: 90px;"
      ref="RefTagsInput"
      :tags="TagsPreset"
      :action="newQuery"
    />
  </div>

  <v-spacer class="my-2"></v-spacer>

  <!-- post content -->
  <div class="my-2">
    <v-row>
      <v-col v-for="(value, key) in Posts" class="ma-2">
        <poster :id="Number(key)" :data="value" :tag-action="newQuery"/>
      </v-col>
    </v-row>
  </div>
  

  <!-- page navigation -->
  <v-pagination 
    v-model="PageVal"
    :length="PageLen"
    @update:model-value="()=>{newQuery()}"
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
    :onComplete="()=>{Dialog=false; newQuery();}"
  ></new-request>
</v-dialog>
<Loading ref="RefLoading"></Loading>
</template>

<script setup>
import {ref, reactive, onMounted, watch, toRaw} from 'vue';
import { useRoute, useRouter  } from 'vue-router';
import TagBar from '@/components/util/TagBar.vue'
import Poster from '@/components/poster/ExplorePoster.vue';
import NewRequest from '@/components/NewRequest.vue'
import Loading from '@/components/util/Loading.vue';

import TagsPreset from '@/plugins/tags'
import * as QUERY from '@/plugins/query'

///// router
const Route = useRoute();
const Router = useRouter();

///// ref
const RefLoading = ref(null);
const RefTagsInput = ref(null);
const PageLen = ref(undefined);

///// v-model
const PageVal = ref(1);
const Dialog = ref(false);
const Posts = reactive({})
var Tags = [];

///// query 
function newQuery(tags = []) {
  if(!assertTags(Tags, tags)) {
    PageVal.value = 1;
  }
  let query = {
    page: PageVal.value
  }
  if(tags && tags.length > 0) {
    query.search = tags;
  } 
  Router.push({
    path: '/home/explore',
    query: query
  })
  applyQuery(query);
}

///// apply server query
function applyQuery(query) {
  PageVal.value = query.page;
  Tags = query.search;
  RefTagsInput.value.setData(Tags);
  fetchData();
}


///// fetch from server
function fetchData(){
  RefLoading.value.show();

  let params = { page : PageVal.value }
  if(Tags && Tags.length > 0) {
    params.str = Tags.join(' ');
  }
  console.log(params);

  QUERY.get('/api/user/request/query_brief', params, 'poster_id')
  .then(data => {
    console.log(data)
    if(PageVal.value > data.total_pages) {
      PageVal.value = data.total_pages;
      return newQuery(Tags);
    }

    Object.keys(Posts).forEach(key => {
      delete Posts[key];
    })
    RefLoading && RefLoading.value.hide();

    PageLen.value = data.total_pages;

    setTimeout(()=>{
      data.data.forEach(element => {
        Posts[element.id] = element
      });
    }, 100);

    
  })
  .catch(err => {
    alert(err);
    Router.push('/home');
  })
}

///// tags assert
function assertTags(old_, new_) {
  try{
    if(new_.length != old_.length) return false;
    new_.forEach(element => {
      if(!old_.includes(element)) return false;
    });
    return true;
  }catch(err) {
    return true;
  }
}

///// Route parse
function parseRoute(query) {
  let data = {
    page: 1,
    search: []
  }
  if(query.page != undefined) data.page = Number(query.page);
  if(data.page < 1) data.page = 1;

  if(query.search) {
    data.search = query.search;
  }

  // console.log({
  //   origin: query,
  //   parsed: data
  // })
  return data;
}

onMounted(() => {
  applyQuery(parseRoute(Route.query));
})


</script>