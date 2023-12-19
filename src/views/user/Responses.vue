<template>
<!-- personal response -->
<template v-if="!checkIsPoster">
  <v-divider class="my-4"/>
  <template v-if="BindReply.personal">
    <p class="ml-2 text-h6 font-weight-bold">我的响应</p>
    <response-view 
      :response_id="BindReply.personal" 
      :modified="BindData.status == 0"
    />
  </template>
  <template v-else>
    <template v-if="!Status.dialog">
      <v-btn class="mb-4" elevation="0" color="blue-accent-2" @click="Status.dialog = true">
        去响应
      </v-btn>
    </template>
    <template v-else>
      <response-view 
        modify_at_init
        :modified="true"
        :responder_id="USER_ID"
        :request_id="REQUEST_ID" 
        :on_cancel="()=>{Status.dialog=false;}"
        :on_success="()=>{Status.dialog=false;}"
      />
    </template>
  </template>
</template>

<!-- all responses -->
<div>
  <p class="ml-2 mt-10 text-h6 font-weight-bold">所有响应</p>
  <template v-for="(uid, index) in BindReply.rest">
    <v-divider class="my-3"/>
    <response-view 
      :response_id="uid"
      :acceptable="checkIsPoster"
    />
  </template>
</div>

<image-amp ref="RefImageAmp"></image-amp>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute  } from 'vue-router';
import ResponseView from '@/components/Response.vue'
import ImageAmp from '@/components/util/ImageAmp.vue';

import * as QUERY from '@/plugins/query'

///// router
const Route = useRoute();

///// const values
const REQUEST_ID = Number(Route.params.id);
const USER_ID = Number(QUERY.get_user_id());

///// ref
const Status = reactive({
  dialog: false,
})
const RefImageAmp = ref(null);

///// v-model
const BindData = reactive({
  poster_id: NaN,
  status: 4,
})

const BindReply = reactive({
  personal: NaN,
  accepted: NaN,
  rest: []
})

///// rules
const checkIsPoster = computed(() => {
  return USER_ID == BindData.poster_id;
})

function filterResponse(data) {
  BindReply.personal = NaN;
  BindReply.rest = []
  data.forEach(element => {
    if(element.responder_id == USER_ID) {
      BindReply.personal = element.id;
    } else if(element.id != BindReply.accepted) {
      BindReply.rest.push(element.id);
    }
  });
}

function init() {
  QUERY.get('/api/user/request/query_detail',{
    request_id : REQUEST_ID
  })
  .then(data => {
    console.log(data)
    const info = data.data;
    BindData.poster_id = Number(info.poster_id);
    BindData.status = info.status;
    BindReply.accepted = info.accepted_response_id;
    filterResponse(info.pending_responses);
  })
}

onMounted(() => {
  init();
})
</script>