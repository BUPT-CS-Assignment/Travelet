<template>
<!-- basic info -->
<div class="d-flex flex-row flex-wrap">

  <!-- latest reponse -->
  <div class="flex-grow-1 mx-auto pr-10 mt-6"
    style="min-width: 440px; max-width: 800px;"
  >
    <v-hover>
      <template v-slot:default="{ isHovering, props }">
        <v-card 
          rounded="lg" variant="flat" 
          v-bind="props"
          :elevation="isHovering ? 10 : 1"
        >
          <v-img :src="Latest.imgs[2]"
            aspect-ratio="4/3"
          />

          <v-hover>
            <template v-slot:default="{ isHovering, props }">
              <v-card rounded="0" elevation="0" 
                class="d-flex flex-column py-4"
                v-bind="props"
                :color="isHovering ? 'blue-accent-3' : ''"
                @click=""
              >
                <p class="align-self-center text-subtitle-1 font-weight-medium">
                  查看最新响应 !
                  <v-card class="align-self-center" elevation="0"
                    height="2px" color="blue-accent-3"
                  />
                </p>
              </v-card>
            </template>
          </v-hover>
          

          <v-divider></v-divider>
          <v-card-text class="d-flex flex-row">
            <v-row justify="center">
              <v-col class="d-flex flex-column">
                <p class="align-self-center">
                  {{ Latest.date }}
                </p>
              </v-col>
              <v-col class="d-flex flex-column">
                <p class="align-self-center">
                  {{ Latest.loc1 }}, {{ Latest.loc2 }}
                </p>
              </v-col>
              <v-col class="d-flex flex-column">
                <p class="align-self-center">
                  {{ Latest.brief }}  
                </p>
              </v-col>
            </v-row>
          </v-card-text>

          <!-- background -->
          
        </v-card>
      </template>
    </v-hover>
  </div>

  <!-- user info -->
  <div class="d-flex flex-column align-self-start mt-6" 
    style="width: 33%; min-width: 300px"
  >
    <!-- Password change -->
    <v-card variant="outlined" rounded="lg" color="grey-lighten-1"
      style="border: 2px dashed; background-color: #fafafa;"
      width="300px" class="pa-4"
    >
      <div class="text-black text-caption">
        <template v-if="!Change">
          <p class="font-weight-bold">
            Travelet 网站建议
          </p>
          <p class="my-1">
            定期检查并更新您的密码
          </p>
          <v-btn color="red" size="small" elevation="0"
            @click="Change = true"
          >
            <p class="text-caption font-weight-bold">更改密码</p>
          </v-btn>
        </template>
        <template v-else>
          <p class="font-weight-bold">
            修改密码
          </p>
          <!-- password -->
          <p>新密码</p>
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

          <div class="d-flex">
            <v-btn color="red" size="small" elevation="0" @click="resetChange">
              <p class="text-caption font-weight-bold">取消</p>
            </v-btn>
            <v-btn color="blue-accent-3" size="small" elevation="0" class="ml-2"
              :disabled="!assert" @click="postChange"
            >
              <p class="text-caption font-weight-bold">确认</p>
            </v-btn>
          </div>
        </template>
        
        
        
      </div>
    </v-card>

    <v-spacer class="my-3"></v-spacer>

    <!-- username -->
    <p class="text-h3 font-weight-bold">
      {{ UserData.name }}
    </p>
    
    <!-- uid and location -->
    <p class="mt-2 text-overline font-weight-regular text-blue-accent-3">
      <strong class="font-weight-bold">UID:</strong>
      {{ UserData.id }} 
    </p>

    <p class="text-subtitle-1 font-weight-bold">
      {{ UserData.loc1 }} 
      <strong class="mx-1">
        <v-avatar size="5" color="grey" />
      </strong>
      {{ UserData.loc2 }}
    </p>

    <v-spacer class="my-4" />
    <v-divider class="mb-6" />
    
    <!-- phone -->
    <div class="d-flex align-center">
      <template v-if="!Update">
        <v-icon size="22" color="grey-darken-1">mdi-cellphone-link</v-icon>
        <p class="ml-3"></p>
        <p> {{ UserData.phone }} </p>
      </template>
      <template v-else>
        <v-text-field variant="outlined" density="compact"
          :rules="[rules.required, rules.lim]"
          v-model="Input.phone"
          prepend-inner-icon="mdi-cellphone-link"
          type="text"
        />
      </template>
    </div>

    <v-spacer class="mt-2"></v-spacer>

    <!-- intro -->
    <div class="d-flex align-center">
      <template v-if="!Update">
        <v-icon size="22" color="grey-darken-1">mdi-card-account-details</v-icon>
        <p class="ml-2"></p>
        <p> {{ UserData.intro }} </p>
      </template>
      <template v-else>
        <v-textarea
          prepend-inner-icon="mdi-card-account-details"
          v-model="Input.intro"
          variant="outlined"
          auto-grow
        />
      </template>
    </div>


    <v-spacer class="my-3" />
    <v-divider class="mb-6" />
    
    <!-- edit profile -->
    <template v-if="!Update">
      <v-btn color="blue-accent-3" class="align-self-start" elevation="0"
        @click="Update = true"
      >
        <p class="text-subtitle-1">更新信息</p>
      </v-btn>
    </template>
    <template v-else>
      <div class="d-flex">
        <v-btn color="red" variant="outlined" class="align-self-start" elevation="0"
          @click="resetUpdate"
        >
          <p class="text-subtitle-1">取消</p>
        </v-btn>
        <v-btn color="blue-accent-3" class="align-self-start ml-2" elevation="0"
          @click="postUpdate"
        >
          <p class="text-subtitle-1">确认</p>
        </v-btn>
      </div>
    </template>
  </div>
</div>

<v-spacer class="my-16"></v-spacer>

<v-divider class="my-4"/>
<!-- response -->
<div class="d-flex flex-column justify-center align-center">
  
  <!-- title -->
  <p class=" text-h5 font-weight-black align-self-center">
    我发布的响应
  </p>

</div>

</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import * as QUERY from '@/plugins/query'

const UserData = reactive({
  name: QUERY.get_user_name(),
  loc1: '',
  loc2: '',
  id: QUERY.get_user_id(),
  phone: '',
  intro: '',
})

const Input = reactive({
  pwd: '',
  pwd2: '',
  phone: '',
  intro: '',
  vis1 : false,
  vis2 : false
})


const Latest = reactive({
  date: '2023.11.28',
  brief: 'Brief',
  loc1:'北京市',
  loc2:'海淀区',
  imgs: ['https://cdn.vuetifyjs.com/images/cards/house.jpg', 
    'https://cdn.vuetifyjs.com/images/cards/road.jpg',
    'https://cdn.vuetifyjs.com/images/cards/plane.jpg'
  ],
})


const Update = ref(false);
const Change = ref(false);

const rules = {
  required: (value) => !!value || '不能为空',
  min: (v) => v.length >= 6 || '长度至少为6位数',
  lim: (v) => v.length == 11 || '长度为11位数',
  number: (v) => (/\d.*\d/.test(v)) || '至少需要两个数字',
  alpha: (v) => (/[a-z]/.test(v) && /[A-Z]/.test(v)) || '不能均为小写或大写',
  match: () => Input.pwd === Input.pwd2 || '两次密码不一致'
};

function resetUpdate() {
  Input.phone = UserData.phone;
  Input.intro = UserData.intro;
  Update.value = false;
}

function postUpdate() {

}

function resetChange() {
  Input.pwd = '';
  Input.pwd2 = '';
  Input.vis1 = false;
  Input.vis2 = false;
  Change.value = false;
}

function postChange() {

}

const assert = computed(() => {
  return rules.required(Input.pwd) === true &&
         rules.required(Input.pwd2) === true &&
         rules.min(Input.pwd === true) &&
         rules.number(Input.pwd) === true &&
         rules.alpha(Input.pwd) === true &&
         rules.match() === true;
})

onMounted(() => {
  QUERY.get('/api/user/info', {}, 'user_id')
  .then(data => {
    let citys = String(data.data.register_city).split(',')
    UserData.loc1 = citys[0]
    UserData.loc2 = citys[1]
    UserData.phone = data.data.telephone
    UserData.intro = data.data.description ? data.data.description : ''

    Input.phone = UserData.phone;
    Input.intro = UserData.intro;
  })
})
</script>