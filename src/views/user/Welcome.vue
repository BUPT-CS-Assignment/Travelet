<template>
<div class="d-flex flex-column">
  <!-- title -->
  <p class=" text-h5 font-weight-black align-self-center">
    有朋自远方来
  </p>

  <!-- data num -->
  <p class="align-self-center text-body-2 text-grey-darken-2">
    {{ UserData.loc1 }}, {{ UserData.loc2 }}
  </p>

    <!-- search bar -->
    <div style="min-width: 400px; max-width: 600px;" class="align-self-center">
      <v-divider class="my-6" />
      <SearchBar class="align-self-center mb-4" style="height: 90px;"
        :tags="TagsPreset"
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
      <v-col v-for="(item, index) in 8" class="ma-2">
        <poster />
      </v-col>
    </v-row>
  </div>

  <!-- page navigation -->
  <v-pagination 
    v-model="CurPage"
    :length="PageLen"
  />
</div>

</template>

<script setup>
import {ref, reactive} from 'vue';
import SearchBar from '@/components/SearchBar.vue'
import Poster from '@/components/ResponsePoster.vue';

const PageLen = ref(1);
const CurPage = ref(1);

const UserData = reactive({
  loc1: '北京市',
  loc2: '海淀区',
})

const TagsPreset = [
  '钓鱼','老少皆宜','休闲','农家院','温泉度假','僻静休闲','游乐场'
]
const search_open = ref(false)

function onTagChange(val) {
  console.log(val)
}



</script>