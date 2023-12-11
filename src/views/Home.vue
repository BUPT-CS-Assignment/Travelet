<template>
<v-app style="background-color: #EEEEEE;">
  <!-- header bar -->
  <v-app-bar class="pt-2 pb-4 " elevation="0" style="background: none;">
    <template v-slot:image>
      <v-img 
        gradient="to bottom, 
          rgba(238,238,238,1) 0%,
          rgba(238,238,238,1) 40%, 
          rgba(238,238,238,.77) 60%,
          rgba(238,238,238,0) 100%"
      />
    </template>
    <logo class="ml-10 mb-2"></logo>

    <!-- navigation -->
    <template v-slot:append>
      <v-hover v-for="(item, key) in Targets" :key="key">
        <template v-slot:default="{ isHovering, props }">
          <v-btn v-bind="props"
            variant="text" rounded="lg"
            :color="isHovering ? 'blue-accent-2' : 'grey-darken-3'"
            @click="targetTo(key)"
          >
            <p class="text-subtitle-1 font-weight-black">
              {{ Targets[key].name }}
            </p>
          </v-btn>
        </template>
      </v-hover>

      <v-btn icon="mdi-logout-variant" color="grey-darken-3"></v-btn>
    </template>
  </v-app-bar>

  <!-- main router page -->
  <v-main class="ma-10">
    <router-view/>
  </v-main>

</v-app>
</template>

<script setup>
import {ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Logo from '@/components/Logo.vue'

const Router = useRouter();

const Targets = {
  about: {
    name: '主页',
    link: '',
    icon: 'mdi-book'
  },
  seeking: {
    name: '寻去处',
    link: '/explore',
    icon: 'mdi-map-search'
  },
  welcome: {
    name: '欢迎来',
    link: '/greet',
    icon: 'mdi-map-marker-star'
  }
}

const Selected = ref('about');
function targetTo(key) {
  Selected.value = key;
  Router.push('/home' + Targets[key].link);
}

onMounted(() => {
  // targetTo('about');
})

</script>
