<template>
<v-hover>
  <template v-slot:default="{ isHovering, props }">
    <v-card 
      rounded="lg" variant="flat" 
      min-width=400 max-width=800 
      v-bind="props"
      :elevation="isHovering ? 6 : 1"
      @click="checkDetail"
    >
      <v-img :src="Data.img"
        lazy-src="https://fakeimg.pl/400x300/?retina=1&text=image&font=lobster"
        aspect-ratio="4/3"
      />
      
      <!-- content -->
      <div class="ma-6">
        <!-- indicator -->
        <div class="my-2" :class="isHovering ? 'mr-8' : 'mr-6'"
          style="position: absolute;right: 0px;"
        >
          <v-avatar v-for="i in 3"
            size="5" style="margin-left: 3px;"
            :color="isHovering ? 'blue-accent-3':'grey-lighten-2'"
          />
        </div>
        
        <!-- titel -->
        <p class="text-h5" style="margin-right: 20px;">
          {{ Data.biref }}
        </p>

        <v-spacer class="my-1"></v-spacer>

        <!-- date -->
        <p class="text-blue-accent-2 text-body-2 mt-4 mb-2">
          {{ Data.date }}
        </p>

        <v-spacer class="my-1"></v-spacer>

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
    </v-card>
  </template>
</v-hover>
</template>

<script setup>
import { ref, reactive } from 'vue';
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

// const StatusString = [
//   {text:'进行中', color:'green'},
//   {text:'已完成', color:'blue-accent-3'},
//   {text:'已取消', color:'red'},
//   {text:'已过期', color:'grey'}
// ]

function tagClick(tag) {
  props.tagAction([tag]);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const Data = reactive({
  tags: props.data.tags,
  date: props.data.create_time,
  biref: props.data.description,
  status: props.data.status,
  img: randomImage(),
})

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