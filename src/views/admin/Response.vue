<template>
<div class="d-flex flex-column">

  <!-- title -->
  <div class="align-self-center d-flex justify-center"
    style="position: relative; width: 200px;"
  >
    <p class=" text-h5 font-weight-black align-self-center">
      “欢迎来”总览
    </p>
    
  </div>
  
  <p class="align-self-center text-body-2 text-grey-darken-2 mt-3">
    共 <strong>{{ TotalNum }} </strong> 条回复
  </p>
  
  
  <!-- search bar -->
  <div style="min-width: 400px; max-width: 600px;" class="align-self-center">
    <v-divider class="my-6" />
  </div>

  <v-spacer class="my-2"></v-spacer>

  <!-- post content -->
  <div class="my-2">
    <v-row>
      <v-col v-for="(value, key) in Posts" class="ma-2">
        <poster :id="Number(key)" :data="value" show_name />
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
import {ref, reactive, onMounted, watch, toRaw} from 'vue';
import { useRoute, useRouter  } from 'vue-router';
//import TagBar from '@/components/util/TagBar.vue'
import Poster from '@/components/poster/ReplyPoster.vue';
import Loading from '@/components/util/Loading.vue';

import * as QUERY from '@/plugins/query'
import * as Events from '@/plugins/event'

///// router
const Route = useRoute();
const Router = useRouter();

///// ref
const RefLoading = ref(null);
const RefSearchInput = ref(null);
const PageLen = ref(undefined);

///// v-model
const PageVal = ref(1);
const TotalNum = ref(0);
const Posts = reactive([])

///// query 
function newQuery() {
  let query = {
    page: PageVal.value
  }
  Router.push({
    path: '/admin/response',
    query: query
  })
  applyQuery(query);
}

///// apply server query
function applyQuery(query) {
  PageVal.value = query.page;
  fetchData();
}

///// fetch from server
function fetchData(){
  RefLoading.value.show();

  let params = { page : PageVal.value }
  console.log(params);

  QUERY.get('/api/user/response/query_brief', params)
  .then(data => {
    console.log(data)

    Posts.splice(0);
    if(RefLoading.value) RefLoading.value.hide();

    PageLen.value = data.total_pages;
    TotalNum.value = data.total_num;
    Events.info('找到 ' + data.total_num + ' 条数据')

    data.data.sort((a, b) => {
      return new Date(b.modify_time) - new Date(a.modify_time)
    })

    setTimeout(()=>{
      data.data.forEach(element => {
        Posts.push(element);
      });
    }, 200);
  })
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