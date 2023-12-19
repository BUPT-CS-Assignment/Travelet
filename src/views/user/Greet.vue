<template>
<div class="d-flex flex-column">
  <!-- title -->
  <p class=" text-h5 font-weight-black align-self-center">
    有朋自远方来
  </p>

  <p class="align-self-center text-body-2 text-grey-darken-2">
    {{ UserCity }}
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
        <poster :id="Number(key)" :data="value"/>
      </v-col>
    </v-row>
  </div>

  <!-- page navigation -->
  <v-pagination 
    v-model="PageVal"
    :length="PageLen"
    @update:model-value="newQuery"
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

///// router
const Route = useRoute();
const Router = useRouter();

///// const values
const UserCity = ref('');
const PageLen = ref(undefined);
const TotalNum = ref(0);

///// ref
const RefTagsInput = ref(null);
const RefLoading = ref(null);


///// v-model
const PageVal = ref(1);
const Posts = reactive({})
var Tags = [];

function newQuery(tags = null) {
  console.log(tags)
  let query = {
    page: PageVal.value
  }
  if(tags != null && tags.length > 0) {
    query.search = tags.join(' ');
  }
  Router.push({
    path: '/home/explore',
    query: query
  })
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
  
  if(Tags.length > 0) {
    params.str = Tags.join(' ');
  }
  QUERY.get('/api/user/request/query_brief', params)
  .then(data => {
    console.log(data)

    Object.keys(Posts).forEach(key => {
      delete Posts[key];
    })
    RefLoading.value.hide();

    PageLen.value = data.total_pages;
    TotalNum.value = (data.total_pages - 1) * 5 + data.data.length;

    data.data.forEach(element => {
      Posts[element.id] = element
    });
  })
  .catch(err => {
    alert(err);
    Router.push('/home');
  })
}

function parseRoute(query) {
  let data = {
    page: 1,
    search: []
  }
  if(query.page) data.page = Number(query.page);
  if(data.page < 1) data.page = 1;

  if(query.search) {
    data.search = query.search.split(' ');
  }
  console.log(data);
  return data;
}

function assertTags(new_tag, old_tag) {
  if(new_tag.length != old_tag.length)
    return false;
  new_tag.forEach((tag, idx) => {
    if(!(tag in old_tag)) return false;
  })
  return true;
}

function applyQuery(query) {
  PageVal.data = query.page;
  Tags = query.search;
  RefTagsInput.value.setData(Tags);
  fetchData();
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

  // watch router change
  watch(() => Route.query, (newVal, oldVal) => {
    console.log(newVal);
    // console.log(oldVal);

    let newData = parseRoute(newVal);
    let oldData = parseRoute(oldVal);
    
    if(!assertTags(newData.search, oldData.search)) {
      PageVal.value = 1;
      newQuery(newData.search);
    } else if(newData.page == oldData.page) {
      return;
    }

    applyQuery(newData);
  })
})

</script>