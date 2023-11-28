<template>
<v-app>
  <!-- header bar -->
  <v-app-bar >
    <logo class="ml-4"></logo>
    
    <!-- navigation -->
    <div class="ml-6 d-flex flex-row">
      <v-btn v-for="(item, key) in Targets" :key="key"
        :variant="Selected === key ? 'tonal' : 'text'"
        color="grey-lighten-1"
        rounded="lg" class="mx-1 px-6"
        @click="targetTo(key)"
      >
        <p class="text-subtitle-1 align-self-end text-black"
          :class="Selected === key ? 'font-weight-black' : 'font-weight-regular'"
        >
          {{ Targets[key].name }}
        </p>
      </v-btn>
    </div>

    <!-- avatar -->
    <template v-slot:append>
      <v-btn variant="plain" rounded="lg">
        <p class="text-black">注销</p>
      </v-btn>
      <v-avatar :size="40" class="ml-1 mr-4" color="grey">
        <span class="text-h6"> {{ Username[0] }}</span>
      </v-avatar>
    </template>
  </v-app-bar>

  <!-- main router page -->
  <v-main>
    <router-view />
  </v-main>

</v-app>
</template>

<script setup>
import {ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Logo from '@/components/Logo.vue'

const Router = useRouter();

const Username = ref('user');

const Targets = {
  about: {
    name: '主页',
    link: '',
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

const Selected = ref('about');
function targetTo(key) {
  Selected.value = key;
  Router.push('/home' + Targets[key].link);
}

onMounted(() => {
  targetTo('about');
})

</script>
