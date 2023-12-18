<template>
<v-app style="background-color: #EEEEEE;">
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
        :rules="[rules.required]"
        v-model="Input.usr"
        prepend-inner-icon="mdi-account-outline"
      />

      <!-- region -->
      <p>地区</p>
      <region-select ref="RegionRef"/>

      <!-- phone number -->
      <p>联系方式</p>
      <v-text-field variant="outlined" density="compact"
        :rules="[rules.required, rules.lim]"
        v-model="Input.phone"
        prepend-inner-icon="mdi-cellphone-link"
        type="text"
      />

      <!-- password -->
      <p>密码</p>
      <v-text-field variant="outlined" density="compact"
        :rules="[rules.min, rules.number, rules.alpha]"
        v-model="Input.pwd"
        :append-inner-icon="Input.vis1 ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
        :type="Input.vis1 ? 'text' : 'password'"
        prepend-inner-icon="mdi-lock-outline"
        @click:append-inner="Input.vis1 = !Input.vis1"
      />

      <!-- comfirm -->
      <p>确认密码</p>
      <v-text-field variant="outlined" density="compact"
        :rules="[rules.required, rules.match]"
        v-model="Input.pwd2"
        :append-inner-icon="Input.vis2 ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
        :type="Input.vis2 ? 'text' : 'password'"
        prepend-inner-icon="mdi-lock-alert-outline"
        @click:append-inner="Input.vis2 = !Input.vis2"
      />

      <!-- register -->
      <v-btn color="green-darken-1" variant="elevated" class="mt-4" width="420px"
        :disabled="!assert"
        @click="register"
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
import * as QUERY from '@/plugins/query'
import { computed } from 'vue';

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

const rules = {
  required: (value) => !!value || '不能为空',
  min: (v) => v.length >= 6 || '长度至少为6位数',
  lim: (v) => v.length == 11 || '长度为11位数',
  number: (v) => (/\d.*\d/.test(v)) || '至少需要两个数字',
  alpha: (v) => (/[a-z]/.test(v) && /[A-Z]/.test(v)) || '不能均为小写或大写',
  match: () => Input.pwd === Input.pwd2 || '两次密码不一致'
};

const assert = computed(() => {
  return rules.required(Input.usr) === true &&
         rules.required(Input.pwd) === true &&
         rules.required(Input.pwd2) === true &&
         rules.required(Input.phone) === true &&
         rules.min(Input.pwd === true) &&
         rules.number(Input.pwd) === true &&
         rules.alpha(Input.pwd) === true &&
         rules.lim(Input.phone) === true &&
         rules.match() === true &&
         (RegionRef.value != null && RegionRef.value.isComplete());
})

function register() {
  if(!assert) {
    alert('注册信息不正确，请检查输入');
    return;
  }

  QUERY.post('api/user/register', {
    username: Input.usr,
    password: Input.pwd,
    telephone: Input.phone,
    register_city: RegionRef.value.getString()
  })
  .then(res => {
    console.log(res)
    if(res.status == 0) {
      alert('注册成功')
      Router.push('/login');
    } else {
      alert('注册失败');
    }
  })
  .catch(err => alert(err))
}


</script>