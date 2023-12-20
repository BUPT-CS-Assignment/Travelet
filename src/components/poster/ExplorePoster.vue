<template>
<v-hover>
  <template v-slot:default="{ isHovering, props }">
    <v-card 
      rounded="lg" variant="flat" 
      min-width=400 max-width=800 
      v-bind="props"
      :elevation="isHovering ? 10 : 1"
      @click="checkDetail"
    >
      <v-img :src="Data.img"
        lazy-src="https://fakeimg.pl/400x300/?retina=1&text=image&font=lobster"
        aspect-ratio="4/3"
      />
      <div class="my-2" :class="isHovering ? 'ml-4' : 'ml-6'">
        <v-avatar v-for="i in 3"
          size="5" style="margin-left: 3px;"
          :color="StatusString[Data.status].color"
        />
      </div>

      <div class="mx-6 mb-6">

        <p class="text-h6">
          {{ Data.biref }}
        </p>

        <div class="d-flex">
          <v-chip size="small" v-for="(tag, index) in Data.tags"
            class="mr-1" color="grey" style="z-index:9"
            @click.stop="tagClick(tag)"
          > 
            <strong class="text-blue-accent-3">#</strong>
            <p class="text-black">{{ tag }}</p>
          </v-chip>
        </div>
      </div>
      
      
      <div class="d-flex flex-row px-6 py-2" style="background-color: #f2f2f2;">
        <v-row class="text-grey text-body-2 font-weight-bold"  justify="space-between">
          <v-col class="d-flex" cols="auto">
            <p class="align-self-center">
            {{ StatusString[Data.status].text }}
          </p>
          </v-col>
          <v-col class="d-flex" cols="auto">
            <p class="align-self-center">
              {{ Data.location }}
            </p>
          </v-col>
          <v-col class="d-flex" cols="auto">
            <p class="ml-auto text-overline">
              {{ Data.date }}
            </p>
          </v-col>
        </v-row>
        
        
        
      </div>
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
  tagAction: {
    type: Function,
    default: () => {}
  }
})

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const StatusString = [
  {text:'进行中', color:'green'},
  {text:'已完成', color:'blue-accent-3'},
  {text:'已取消', color:'red'},
  {text:'已过期', color:'grey'}
]

const Data = reactive({
  location: props.data.city,
  tags: props.data.tags,
  date: props.data.create_time,
  biref: props.data.description,
  status: props.data.status,
  img: randomImage(),
})

function tagClick(tag) {
  props.tagAction([tag]);
}

function randomImage() {
  const len = props.data.image_files.length;
  if(len == 0) return null;
  const index = getRandomInt(len - 1);
  return QUERY.fileURL(props.data.image_files[index].id);
}

function checkDetail() {
  Router.push('/home/detail/' + props.id)
}

</script>