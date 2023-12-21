<template>
<div class="d-flex flex-column">
  <!-- title -->
  <p class=" text-h5 font-weight-black align-self-center">
    天涯若比邻
  </p>

  <p class="align-self-center text-body-2 text-grey-darken-2 mt-3">
    <strong>{{ UserCity }}</strong> -
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
    <!-- header -->
    <div class="d-flex flex-row ml-auto">
      <!-- post new -->
  </div>


  <!-- post content -->
  <div class="my-2">
    <v-row>
      <v-col v-for="(value, key) in Posts" justify="center">
        <poster :id="Number(value.id)" :data="value" :tagAction="newQuery"/>
      </v-col>
    </v-row>
  </div>

  <!-- page navigation -->
  <v-pagination 
    v-model="PageVal"
    :length="PageLen"
    @update:model-value="()=>{newQuery();}"
  />
</div>
<Loading ref="RefLoading"></Loading>
</template>

<script setup>
import {ref, reactive, onMounted, watch} from 'vue';
import { useRoute, useRouter  } from 'vue-router';
import TagBar from '@/components/util/TagBar.vue'
import Poster from '@/components/poster/GreetPoster.vue';
import Loading from '@/components/util/Loading.vue';

import TagsPreset from '@/plugins/tags'
import * as QUERY from '@/plugins/query'
import * as Events from '@/plugins/event'

///// router
const Route = useRoute();
const Router = useRouter();

///// const values
const UserCity = ref('');
const PageLen = ref(1);
const TotalNum = ref(0);

///// ref
const RefTagsInput = ref(null);
const RefLoading = ref(null);


///// v-model
const PageVal = ref(1);
const Posts = reactive([])
var Tags = [];

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
    path: '/home/greet',
    query: query
  })
  applyQuery(query);
}

function fetchData(){
  if(!UserCity.value && UserCity.value.length == 0)
    return;
  RefLoading.value.show();

  let params = {
    page : PageVal.value,
    city : String(UserCity.value),
    is_responder:1
  }
  
  if(Tags && Tags.length > 0) {
    params.str = Tags.join(' ');
  }

  console.log(params);
  QUERY.get('/api/user/request/query_brief', params, 'poster_id')
  .then(data => {
    console.log(data)

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


function applyQuery(query) {
  PageVal.value = query.page;
  Tags = query.search;
  RefTagsInput.value.setData(Tags);
  fetchData();
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
    return false;
  }
}

///// parse router
function parseRoute(query) {
  let data = {
    page: 1,
    search: []
  }
  if(query.page) data.page = Number(query.page);
  if(data.page < 1) data.page = 1;

  if(query.search) {
    if(typeof(query.search) == 'string')
      data.search = [query.search];
    else if(Array.isArray(query.search))
      data.search = query.search;
  }
  // console.log(data);
  return data;
}

onMounted(() => {
  // console.log(Route.query)
  const city = QUERY.get_user_city();
  if(!city) {
    RefLoading.value.show();
    QUERY.get('/api/user/info', {}, 'user_id')
    .then(data => {
      QUERY.set_user_city(data.data.register_city);
      UserCity.value = String(data.data.register_city);
      applyQuery(parseRoute(Route.query));
    })
  } else {
    UserCity.value = String(city);
    applyQuery(parseRoute(Route.query));
  }
})

</script>