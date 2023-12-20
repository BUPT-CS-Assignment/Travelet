<template>
<v-hover>
  <template v-slot:default="{ isHovering, props }">
    <v-card 
      rounded="lg" variant="flat" 
      min-width=400 
      v-bind="props"
      :elevation="isHovering ? 6 : 1"
      @click="checkDetail"
    >
      <v-img :src="Data.img"
        lazy-src="https://fakeimg.pl/400x300/?retina=1&text=image&font=lobster"
        height="330" cover
      />
      
      <!-- content -->
      <div>
        <!-- indicator -->
        <div class="my-4" :class="isHovering ? 'mr-12' : 'mr-10'"
          style="position: absolute;right: 0px;"
        >
          <v-avatar v-for="i in 3"
            size="6" style="margin-left: 4px;"
            :color="isHovering ? 'blue-accent-3':'grey-lighten-2'"
          />
        </div>
        
        <!-- titel -->
        <p class="text-h5 mt-6 ml-6 d-inline-block text-truncate" style="margin-right: 20px;">
          {{ Data.biref }}
        </p>

        <v-spacer class="my-2"></v-spacer>


        <div class="d-flex ml-6">
          <v-chip size="small" v-for="(tag, index) in Data.tags"
            class="mr-1" color="grey" style="z-index:9"
            @click.stop="tagClick(tag)"
          > 
            <strong class="text-blue-accent-3">#</strong>
            <p class="text-black">{{ tag }}</p>
          </v-chip>
        </div>

        <v-divider class="mt-4" />

        <div class="d-flex flex-row px-6 py-3">
          <v-row class="text-grey text-subtitle-2 font-weight-medium"  justify="space-around">
            <v-col class="d-flex align-end" cols="auto">
              <v-icon size="25">mdi-account-outline</v-icon>
              <p class="ml-1">
              {{ Data.poster }}
            </p>
            </v-col>
            <v-col class="d-flex align-end" cols="auto">
              <v-icon size="23">mdi-card-text-outline</v-icon>
              <p class="ml-2 font-weight-bold">
                {{ Data.reply }}
              </p>
            </v-col>
            <v-col class="d-flex align-end" cols="auto">
              <v-icon size="23">mdi-alarm</v-icon>
              <p class="ml-2">
                {{ Data.date }}
              </p>
            </v-col>
          </v-row>
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
  poster: props.data.poster,
  date: props.data.modify_time,
  biref: props.data.description,
  status: props.data.status,
  reply: props.data.reply,
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