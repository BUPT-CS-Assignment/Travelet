<template>
<v-app>
<v-main class="d-flex flex-column">
  <!-- header -->
  <div>
    <logo justify-start class="ml-4"/>
  </div>
  
  <!-- main content -->
  <v-container fluid class="fill-height d-flex flex-row justify-center">
    <!-- input -->
    <div style="width: 420px;" class="align-self-center">
      <p class="text-h4 font-weight-black mb-10">登录到 Travelet</p>
      <!-- username -->
      <p>用户名</p>
      <v-text-field variant="outlined" density="compact"
        v-model="Input.usr"
        prepend-inner-icon="mdi-account-outline"
      />
      <!-- password -->
      <p>密码</p>
      <v-text-field variant="outlined" density="compact"
        v-model="Input.pwd"
        :append-inner-icon="Input.vis ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
        :type="Input.vis ? 'text' : 'password'"
        prepend-inner-icon="mdi-lock-outline"
        @click:append-inner="Input.vis = !Input.vis"
      />
      <!-- login -->
      <v-btn color="blue-accent-3" variant="elevated" class="mt-4" width="300px" :disabled="Input.pwd.length == 0">
        <p class="font-weight-bold">登录</p>
      </v-btn> 
      <!-- register -->
      <div class="d-flex flex-row my-2" style="width: 300px;">
        <v-divider class="align-self-center mr-3"/>
        <p class="text-body-2 font-weight-thin font-italic text-grey-lighten-1">或</p>
        <v-divider class="align-self-center ml-3"/>
      </div>
      <v-btn color="grey-darken-3" variant="outlined" class="" width="300px" @click="targetRegister">
        <v-icon size="large" icon="mdi-account-plus"/>
        <p class="font-weight-bold ml-1">注册</p>
      </v-btn> 
    </div>


    <!-- brief intro -->
    <div class="mx-16"></div>
    <v-card class="d-flex flex-column" variant="text" style="width: 400px;">
      <!-- <v-card-title>
        <p class="text-h4 font-weight-black text-grey-darken-2 mb-4">{{ Intro.title }}</p>
      </v-card-title> -->
      <v-card-text class="align-self-center justify-center">
        <div v-for="(item, index) in Intro.content" class="d-flex flex-row my-8">
          <v-icon class="align-self-center mr-2" size="large" color="grey-darken-1">{{ item[1] }}</v-icon>
          <p class="text-h6 font-weight-bold text-grey-darken-1 align-self-center">{{ item[0] }}</p>
        </div>
      </v-card-text>
    </v-card>

  </v-container>
    
</v-main>
</v-app>
</template>

<script setup>
import { ref, reactive } from 'vue';
import Logo from '@/components/Logo.vue';
import { useRouter } from 'vue-router';

const Router = useRouter();

const Input = reactive({
  usr : '',
  pwd : '',
  vis : false
})

const Intro = {
  content: [
    ['轻松发现&分享', 'mdi-map-search-outline'],
    ['个性化探索', 'mdi-map-marker-path'],
    ['互动社区', 'mdi-account-multiple']
  ], 
}

function targetRegister() {
  Input.usr = '';
  Input.pwd = '';
  Input.vis = false

  Router.push('/register');
}

</script>