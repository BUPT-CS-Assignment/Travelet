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

      <v-btn icon="mdi-logout-variant" color="grey-darken-3" @click="logout"></v-btn>
    </template>
  </v-app-bar>

  <!-- main router page -->
  <v-main class="ma-10">
    <router-view/>
  </v-main>

</v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Logo from '@/components/util/Logo.vue';
import {assert_admin, clear} from '@/plugins/query'

const Router = useRouter();

const Targets = {
	about: {
	name: '账单',
	link: '/bill',
	icon: 'mdi-book'
	},
	user: {
	name: '用户',
	link: '/user',
	icon: 'mdi-account'
	},
	seeking: {
	name: '寻去处',
	link: '/request',
	icon: 'mdi-map-search'
	},
	welcome: {
	name: '欢迎来',
	link: '/response',
	icon: 'mdi-map-marker-star'
	}
}

const Selected = ref('bill');
function targetTo(key) {
	Selected.value = key;
	Router.push('/admin' + Targets[key].link);
}

function logout() {
	if(confirm('确认登出?')) {
	clear();
	Router.push('/login');
	}
}

onMounted(() => {
	if(!assert_admin()) {
	Router.push('/login');
	return;
	}  
})

</script>
