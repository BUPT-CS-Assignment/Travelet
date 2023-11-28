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
      <p class="text-h4 font-weight-black mb-6">加入 Travelet</p>
      <!-- username -->
      <p>用户名</p>
      <v-text-field variant="outlined" density="compact"
        v-model="Input.usr"
        prepend-inner-icon="mdi-account-outline"
      />

      <!-- region -->
      <p>地区</p>
      <region-select ref="RegionRef"/>

      <!-- phone number -->
      <p>联系方式</p>
      <v-text-field variant="outlined" density="compact"
        v-model="Input.phone"
        prepend-inner-icon="mdi-cellphone-link"
        type="text"
      />

      <!-- password -->
      <p>密码</p>
      <v-text-field variant="outlined" density="compact"
        v-model="Input.pwd"
        :append-inner-icon="Input.vis1 ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
        :type="Input.vis1 ? 'text' : 'password'"
        prepend-inner-icon="mdi-lock-outline"
        @click:append-inner="Input.vis1 = !Input.vis1"
      />

      <!-- comfirm -->
      <p>确认密码</p>
      <v-text-field variant="outlined" density="compact"
        v-model="Input.pwd2"
        :append-inner-icon="Input.vis2 ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
        :type="Input.vis2 ? 'text' : 'password'"
        prepend-inner-icon="mdi-lock-alert-outline"
        @click:append-inner="Input.vis2 = !Input.vis2"
      />

      <!-- login -->
      <v-btn color="green-darken-1" variant="elevated" class="mt-4" width="420px"
        :disabled="Input.usr.length == 0 || Input.pwd.length == 0 || Input.pwd2.length == 0 || RegionRef.getCity().length == 0"
      >
        <p class="font-weight-bold">注册</p>
      </v-btn> 

      <!-- register -->
      <div class="d-flex flex-row my-2" style="width: 420px;">
        <v-divider class="align-self-center mr-3"/>
        <p class="text-body-2 font-weight-thin font-italic text-grey-lighten-1">或</p>
        <v-divider class="align-self-center ml-3"/>
      </div>
      <v-btn color="grey-darken-3" variant="outlined" class="" width="420px" @click="targetLogin">
        <v-icon size="large" icon="mdi-account"/>
        <p class="font-weight-bold ml-1">立即登录</p>
      </v-btn> 
    </div>

  </v-container>
    
</v-main>
</v-app>
</template>

<script setup>
import { ref, reactive, toRaw, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Logo from '@/components/Logo.vue';
import RegionSelect from '@/components/RegionSelect.vue';

const RegionRef = ref(null);
const Router = useRouter();

const Input = reactive({
  usr : '',
  pwd : '',
  pwd2 : '',
  phone: '',
  vis1 : false,
  vis2 : false,
})


function targetLogin() {
  Input.usr = '';
  Input.pwd = '';
  Input.pwd2 = '';
  Input.phone = '';
  Input.vis1 = false;
  Input.vis2 = false;
  RegionRef.value.clear()
  Router.push('/login');
}


</script>