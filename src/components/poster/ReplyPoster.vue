<template>
<v-hover>
  <template v-slot:default="{ isHovering, props }">
    <v-card 
      rounded="lg" variant="flat" class="pa-3"
      min-width=330 max-width=600 
      v-bind="props"
      :elevation="isHovering ? 10 : 1"
      @click="checkDetail"
    >
      <!-- status -->
      <v-chip v-if="Data.post_status != -1" class="ml-2 font-weight-bold"  label 
        :color="StatusString[Data.post_status].color"
      >
        {{ StatusString[Data.post_status].text }}
      </v-chip>

      <v-chip v-if="Data.status == 1" label color="green" class="align-self-start ml-3">
        <v-icon size="small">mdi-star</v-icon>
        <p class="font-weight-bold ml-1">被采纳</p>
      </v-chip>
      <v-chip v-if="Data.status == 2" label color="red" class="align-self-start ml-3">
        <v-icon size="small">mdi-cancel</v-icon>
        <p class="font-weight-bold ml-1">被拒绝</p>
      </v-chip>

      <!-- reply content -->
      <p class="ml-3 mt-2 mr-3"> 
        <strong class="text-subtitle-1 font-weight-bold mr-2">
          {{ Data.responder}} 于 {{ Data.modify_time }} 回复 :</strong>
        {{ Data.description }} 
      </p>

      <v-card variant="tonal" class="mx-2 my-2 px-3 pt-2 pb-3" rounded="lg">
        <div class="d-flex">
          <v-icon class="mt-1" size="33" color="grey-darken-2">mdi-format-quote-open</v-icon>
          <div style="width:100%">
            <p class="ml-2 mt-2 text-grey-darken-1 mr-2"> 
              <strong class="text-subtitle-1 font-weight-bold mr-2"> {{ Data.poster }} 于 {{ Data.post_time }} 发布 : </strong>
              {{ Data.biref }}
            </p>
            <!-- image -->
            <div class="px-3" v-if="Data.img">
              <v-img :src="Data.img"
                lazy-src="https://fakeimg.pl/200x200/?retina=1&text=image&font=lobster"
                aspect-ratio="1"
                height="200" cover
              />
            </div>
          </div>
        </div>
      </v-card>
    </v-card>
  </template>
</v-hover>

</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import * as QUERY from '@/plugins/query'

const Router = useRouter();

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  data: {
    type: Object,
    required: true
  },
  show_name: {
    type: Boolean,
    default: false
  }
})

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const StatusString = [
  {text:'进行中', color:'blue-accent-3'},
  {text:'已结束', color:'green'},
  {text:'已取消', color:'red'},
  {text:'已过期', color:'grey'}
]

const Data = reactive({
  request_id: props.data.request_id,
  poster: props.data.poster,
  responder: '',
  description: props.data.description,
  modify_time: props.data.modify_time,
  status: props.data.status,
  biref: '',
  img: null,
  post_time: '',
  post_status: -1,
})

function randomImage(array) {
  const len = array.length;
  if(len == 0) return null;
  const index = getRandomInt(len - 1);
  return QUERY.fileURL(array[index].id);
}

function checkDetail() {
  Router.push('/home/detail/' + Data.request_id)
}

function queryBrief() {
  QUERY.get('/api/user/request/query_brief', {
    request_id : Data.request_id
  })
  .then(data => {
    console.log(data)
    Data.biref = data.data.description;
    Data.img = randomImage(data.data.image_files);
    Data.post_time = data.data.modify_time;
    Data.post_status = Number(data.data.status)
  })
}

onMounted(()=>{
  if(props.show_name) {
    Data.responder = props.data.responder;
  }
  queryBrief();
})

</script>