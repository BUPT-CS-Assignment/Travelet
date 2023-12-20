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
    
    <p class="align-self-center text-caption text-grey-darken-2 mt-2">
      第 {{ PageVal }} 页 / 共 {{ PageLen }} 页
    </p>
    
    
    <!-- search bar -->
    <!--div style="min-width: 400px; max-width: 600px;" class="align-self-center">
      <v-divider class="my-6" />
      <TagBar class="align-self-center mb-4" style="height: 90px;"
        ref="RefSearchInput"
        :action="newQuery"
      />
    </div-->
  
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
  const Posts = reactive({})
  
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
    RefSearchInput.value.setData(query.search);
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
      if(PageVal.value > data.total_pages) {
        PageVal.value = data.total_pages;
        return newQuery();
      }
  
      Object.keys(Posts).forEach(key => {
        delete Posts[key];
      })
      if(RefLoading.value) RefLoading.value.hide();
  
      PageLen.value = data.total_pages;
      Events.info('找到 ' + data.total_pages + ' 页数据')
  
      setTimeout(()=>{
        data.data.forEach(element => {
          Posts[element.id] = element
        });
      }, 100);
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