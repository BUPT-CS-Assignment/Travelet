<template>
<div>
  <v-row>
    <v-col>
      <v-select
        v-model="Input.loc1"
        :items="provinces"
        density="compact" variant="outlined"
        @update:model-value="updateCities"
      ></v-select>
    </v-col>
    <v-col>
      <v-select
        v-model="Input.loc2"
        :items="cities" :disabled="Input.loc1.length == 0"
        density="compact" variant="outlined"
      ></v-select>
    </v-col>
  </v-row>  
</div>

</template>

<script setup>
import { reactive, ref, toRaw } from 'vue';
import CITIES from '@/plugins/cities'

const provinces = Object.keys(CITIES);
let cities = ref([])

const Input = reactive({
  loc1 : '',
  loc2 : ''
})

function updateCities() {
  Input.loc2 = ''
  cities.value = CITIES[toRaw(Input).loc1]
}

defineExpose({
  getProvince: () => Input.loc1,
  getCity: () => Input.loc2,
  getString: () => `${Input.loc1},${Input.loc2}`,
  isComplete: () => Input.loc1.length > 0 && Input.loc2.length > 0,
  clear: () => {
    Input.loc1 = ''
    Input.loc2 = ''
  }
})

</script>