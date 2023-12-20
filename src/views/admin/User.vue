<template>
<div class="d-flex flex-column">
  <!-- title -->
  <div class="align-self-center d-flex justify-center"
    style="position: relative; width: 200px;"
  >
    <p class=" text-h5 font-weight-black align-self-center">
      用户总览
    </p>
    
  </div>

  <p class="align-self-center text-body-2 text-grey-darken-2 mt-3">
    共 <strong>{{ TotalNum }} </strong> 个用户
  </p>

  <!-- search bar -->
  <div style="min-width: 400px; max-width: 600px;" class="align-self-center">
    <v-divider class="my-6" />
  </div>

  <v-spacer class="my-2"></v-spacer>

  <!-- post content -->
  <div class="my-2">
    <v-row justify="space-around">
      <v-col v-for="(value, idx) in Users" class="ma-2" cols="auto">
        <poster :data="value" />
      </v-col>
    </v-row>
  </div>
</div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import Poster from '@/components/poster/UserPoster.vue';
import * as QUERY from '@/plugins/query'

///// v-model
const TotalNum = ref(0);
const Users = reactive([])

onMounted(()=>{
  QUERY.post('/api/admin/query/user', {})
  .then(data => {
    console.log(data)
    TotalNum.value = data.data.length;
    data.data.forEach((item)=>{
      Users.push(item);
    })
  })
})

</script>