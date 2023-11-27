<template>
<v-app>
  <!-- header bar -->
  <v-app-bar >
    <logo class="ml-4"></logo>
    
    <div class="ml-6 d-flex flex-row">
      <v-btn v-for="(item, key) in Targets" :key="key"
        :variant="Selected === key ? 'tonal' : 'text'"
        color="grey"
        rounded="lg" class="mx-1"
        @click="targetTo(key)"
      >
        <p class="text-subtitle-1 align-self-end text-black"
          :class="Selected === key ? 'font-weight-black' : 'font-weight-light'"
        >
          {{ Targets[key].name }}
        </p>
      </v-btn>
    </div>
  </v-app-bar>

  <!-- main router page -->
  <v-main>
    <router-view />
  </v-main>

  <!-- router -->
  
</v-app>
</template>

<script setup>
import {ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Logo from '@/components/Logo.vue'

const Router = useRouter();

const Targets = {
  home: {
    name: '主页',
    link: '/home',
    icon: 'mdi-book'
  },
  seeking: {
    name: '寻去处',
    link: '/seeking',
    icon: 'mdi-map-search'
  },
  welcome: {
    name: '欢迎来',
    link: '/welcome',
    icon: 'mdi-map-marker-star'
  }
}

const Selected = ref('home');
function targetTo(key) {
  Selected.value = key;
  Router.push(Targets[key].link);
}

onMounted(() => {
  targetTo('home');
})

</script>
