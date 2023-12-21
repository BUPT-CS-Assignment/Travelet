<template>
<div class="d-flex flex-column">

  <!-- title -->
  <div class="align-self-center d-flex justify-center"
    style="position: relative; width: 200px;"
  >
    <p class=" text-h5 font-weight-black align-self-center">
      “寻去处”总览
    </p>
    
  </div>
  
  <p class="align-self-center text-body-2 text-grey-darken-2 mt-3">
    共 <strong>{{ TotalNum }} </strong> 条请求
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
    <v-row justify="space-around">
      <v-col v-for="(value, key) in Posts" class="ma-2" cols="auto">
        <poster :id="Number(key)" :data="value" name :tag-action="newQuery"/>
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
<Loading ref="RefLoading"></Loading>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue';
import { useRoute, useRouter  } from 'vue-router';
import TagBar from '@/components/util/TagBar.vue'
import Poster from '@/components/poster/ExplorePoster.vue';
import Loading from '@/components/util/Loading.vue';

import TagsPreset from '@/plugins/tags'
import * as QUERY from '@/plugins/query'
import * as Events from '@/plugins/event'

///// router
const Route = useRoute();
const Router = useRouter();

///// ref
const RefLoading = ref(null);
const RefTagsInput = ref(null);
const PageLen = ref(1);
const TotalNum = ref(0);

///// v-model
const PageVal = ref(1);
const Posts = reactive([])
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
    path: '/admin/request',
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

  QUERY.get('/api/user/request/query_brief', params)
  .then(data => {
    console.log(data)
    if(PageVal.value > data.total_pages) {
      PageVal.value = data.total_pages;
      return newQuery(Tags);
    }

    Posts.splice(0);
    if(RefLoading.value) RefLoading.value.hide();

    PageLen.value = data.total_pages;
    TotalNum.value = data.total_num;
    Events.info('找到 ' + data.total_num + ' 条数据')

    data.data.sort((a, b) => {
      if(a.status == b.status) return new Date(b.modify_time) - new Date(a.modify_time);
      else return a.status - b.status;
    })

    setTimeout(()=>{
      data.data.forEach(element => {
        Posts.push(element);
      });
    }, 200);
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
    if(typeof(query.search) == 'string')
      data.search = [query.search];
    else if(Array.isArray(query.search))
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