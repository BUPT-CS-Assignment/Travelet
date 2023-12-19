<template>
<v-app style="background-color: #EEEEEE;" class="d=flex">
<div>
  <logo justify-start class="ml-4"/>
</div>

<v-main class="align-self-center" max-width="1000px">
  <!-- main content -->
  <div class="fill-height d-flex flex-row flex-wrap">
    <!-- input -->
    <div style="width: 420px;" class="ml-16 align-self-center">
      <p class="text-h4 font-weight-black mb-10">登录到 Travelet</p>
      <!-- username -->
      <p>用户名</p>
      <v-text-field variant="outlined" density="compact"
        :rules="[rules.required]"
        v-model="Input.usr"
        prepend-inner-icon="mdi-account-outline"
      />
      <!-- password -->
      <p>密码</p>
      <v-text-field variant="outlined" density="compact"
        :rules="[rules.required]"
        v-model="Input.pwd"
        :append-inner-icon="Input.vis ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
        :type="Input.vis ? 'text' : 'password'"
        prepend-inner-icon="mdi-lock-outline"
        @click:append-inner="Input.vis = !Input.vis"
      />
      <!-- login -->
      <v-btn color="blue-accent-3" variant="elevated" class="mt-4" width="300px" 
        :disabled="Input.pwd.length == 0"
        @click="login"
        >
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
    <v-card class="ml-16 d-flex flex-column align-self-center" variant="text" style="width: 420px;">
      <!-- <v-card-title>
        <p class="text-h4 font-weight-black text-grey-darken-2 mb-4">{{ Intro.title }}</p>
      </v-card-title> -->
      <v-card-text class="align-self-start justify-center">
        <div v-for="(item, index) in Intro.content" class="d-flex flex-row my-8">
          <v-icon class="align-self-center mr-2" size="large" color="grey-darken-1">{{ item[1] }}</v-icon>
          <p class="text-h6 font-weight-bold text-grey-darken-1 align-self-center">{{ item[0] }}</p>
        </div>
      </v-card-text>
    </v-card>

  </div>
</v-main>
</v-app>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import Logo from '@/components/util/Logo.vue';

import * as QUERY from '@/plugins/query'


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

const rules = {
  required: (value) => !!value || '不能为空'
}

const assert = computed(() => {
  return rules.required(Input.usr) === true && rules.required(Input.pwd) === true;
})

function login() {
  if(!assert) {
    alert('用户名或密码不能为空');
    return;
  }

  QUERY.post('/api/user/login',{
    username: Input.usr,
    password: Input.pwd
  })
  .then(res => {
    if(res.status == 0){
      QUERY.set_user_name(Input.usr);
      QUERY.set_user_id(res.user_id);
      if(Input.usr == 'admin')
        Router.push('/admin');
      else
        Router.push('/home');
    }
    else alert('用户名或密码错误');
  })
}
  
</script>