<template>
<!-- basic info -->
<div class="d-flex flex-row flex-wrap">

  <!-- latest reponse -->
  <div class="flex-grow-1 mx-3 pr-10 my-6"
    style="min-width: 500px;"
  >
    <v-hover>
      <template v-slot:default="{ isHovering, props }">
        <v-card 
          rounded="lg" variant="flat" 
          v-bind="props"
          :elevation="isHovering ? 10 : 1"
        >
          <v-img :src="Latest.img" cover
            max-height="500"
          />

          <template v-if="Latest.flag">
            <v-hover>
              <template v-slot:default="{ isHovering, props }">
                <v-card rounded="0" elevation="0" 
                  class="d-flex flex-column py-4"
                  v-bind="props"
                  :color="isHovering ? 'blue-accent-3' : ''"
                  @click="checkLatest"
                >
                  <p class="align-self-center text-subtitle-1 font-weight-medium">
                    查看最新回复 !
                    <v-card class="align-self-center" elevation="0"
                      height="2px" color="blue-accent-3"
                    />
                  </p>
                </v-card>
              </template>
            </v-hover>
          </template>
          <template v-else>
            <v-card rounded="0" elevation="0" class="d-flex flex-column py-4">
              <p class="align-self-center text-subtitle-1 font-weight-medium">
                暂无回复
                <v-card class="align-self-center" elevation="0"
                  height="2px" color="blue-accent-3"
                />
              </p>
            </v-card>
          </template>

          <!-- basic info -->
          <v-divider></v-divider>
          <v-card-text class="d-flex flex-row">
            <template v-if="Latest.flag">
              <v-row justify="center">
                <v-col class="d-flex flex-column">
                  <p class="align-self-center">
                    {{ Latest.date }}
                  </p>
                </v-col>
                <v-col class="d-flex flex-column">
                  <p class="align-self-center">
                    {{ Latest.city }}
                  </p>
                </v-col>
                <v-col class="d-flex flex-column">
                  <span class="align-self-center d-inline-block text-truncate">
                    {{ Latest.brief }}  
                  </span>
                </v-col>
              </v-row>
            </template>
            <template v-else>
              <div class="d-flex justify-center" style="width:100%">
                <p class="align-self-center">
                  等待其他用户回应
                </p>
              </div>
            </template>
          </v-card-text>

          <!-- background -->
          
        </v-card>
      </template>
    </v-hover>
  </div>

  <!-- user info -->
  <div class="d-flex flex-column align-self-start mt-6 ml-3 mr-auto" 
    style="width: 400px;"
  >
    <!-- Password change -->
    <v-card variant="outlined" rounded="lg" color="grey-lighten-1"
      style="border: 2px dashed; background-color: #fafafa;"
      class="pa-4"
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
              :disabled="!input_assert" @click="postChange"
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
          type="number"
          hide-spin-buttons
        />
      </template>
    </div>

    <v-spacer class="mt-2"></v-spacer>

    <!-- intro -->
    <div class="d-flex align-center">
      <template v-if="!Update">
        <v-icon size="22" color="grey-darken-1">mdi-card-account-details</v-icon>
        <p class="ml-2"></p>
        <p style="word-break: break-all;"> {{ UserData.intro }} </p>
      </template>
      <template v-else>
        <v-textarea
          counter
          prepend-inner-icon="mdi-card-account-details"
          v-model="Input.intro"
          variant="outlined"
          auto-grow
          :rules="[rules.max]"
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
          :disabled="!input_assert2" @click="postUpdate"
        >
          <p class="text-subtitle-1">确认</p>
        </v-btn>
      </div>
    </template>
  </div>
</div>

<v-spacer class="my-16"></v-spacer>

<v-spacer class="my-4"/>

<!-- title -->
<p class="text-h5 font-weight-black align-self-center ml-3">
  全部回复 {{ TotalNum }}
</p>

<!-- post content -->
<div class="my-2">
  <v-row>
    <v-col v-for="(value, key) in Reply" class="ma-2">
      <poster :id="Number(value.id)" :data="value"/>
    </v-col>
  </v-row>
</div>

</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Poster from '@/components/poster/ReplyPoster.vue'

import * as QUERY from '@/plugins/query'
import {assert} from '@/plugins/query'
import * as Events from '@/plugins/event'

const Router = useRouter();

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
  flag: false,
  request_id: '',
  date: '',
  brief: '',
  city: '',
  img: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg'
})


const Update = ref(false);
const Change = ref(false);
const Reply = reactive([])
const TotalNum = ref(0);

const rules = {
  required: (value) => !!value || '不能为空',
  min: (v) => v.length >= 6 || '长度至少为6位数',
  lim: (v) => v.length == 11 || '长度为11位数',
  max: (v) => v.length <= 200 || '不能超过200个字符',
  number: (v) => (/\d.*\d/.test(v)) || '至少需要两个数字',
  alpha: (v) => (/[a-z]/.test(v) && /[A-Z]/.test(v)) || '不能均为小写或大写',
  match: () => Input.pwd === Input.pwd2 || '两次密码不一致'
};

function resetUpdate() {
  Input.phone = UserData.phone;
  Input.intro = UserData.intro;
  Update.value = false;
}

const input_assert2 = computed(() => {
  return rules.lim(Input.phone) === true &&
         rules.max(Input.intro) === true &&
         (Input.phone !== UserData.phone ||
         Input.intro !== UserData.intro);
})

function postUpdate() {
  if(!input_assert2) {
    Events.warn('请检查输入');
    return;
  }

  let data = {}
  if(Input.phone !== UserData.phone) data.telephone = Input.phone;
  if(Input.intro !== UserData.intro) data.description = Input.intro;

  if(data == {}) {
    Events.warn('没有修改任何信息');
    return;
  }

  if(!confirm('确认修改信息?')) return;

  QUERY.post('/api/user/modify_data', data, 'user_id')
  .then(data => {
    Events.info('修改成功')
    UserData.phone = Input.phone;
    UserData.intro = Input.intro;
    resetUpdate();
  })
}

function resetChange() {
  Input.pwd = '';
  Input.pwd2 = '';
  Input.vis1 = false;
  Input.vis2 = false;
  Change.value = false;
}

function postChange() {
  if(!input_assert) {
    Events.warn('请检查输入');
    return;
  }

  if(!confirm('确认修改密码?')) return;

  QUERY.post('/api/user/modify_data', {
    password: Input.pwd
  }, 'user_id')
  .then(data => {
    Events.info('修改成功')
    resetChange();
  })
}

const input_assert = computed(() => {
  return rules.required(Input.pwd) === true &&
         rules.required(Input.pwd2) === true &&
         rules.min(Input.pwd === true) &&
         rules.number(Input.pwd) === true &&
         rules.alpha(Input.pwd) === true &&
         rules.match() === true;
})

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function randomImage(data) {
  const len = data.length;
  if(len == 0) return null;
  const index = getRandomInt(len - 1);
  return QUERY.fileURL(data[index].id);
}

function fetchLatest() {
  QUERY.get('/api/user/request/query_lasted', {}, 'poster_id')
  .then(data => {
    console.log(data)
    if(!data.data || data.data.length == 0) {
      Latest.flag = false;
      return;
    }
    Latest.flag = true;
    Latest.date = data.data.latest_response_time;
    Latest.city = data.data.city;
    Latest.request_id = data.data.id;
    if(data.data.image_files.length > 0) {
      Latest.img = randomImage(data.data.image_files)
    }
    Latest.brief = data.data.brief
  }) 
}

function checkLatest() {
  Router.push('/home/detail/' + Latest.request_id)
}


function fetchReply(){
  QUERY.get('/api/user/response/query_brief', {
    responder_id : UserData.id
  })
  .then(data => {
    console.log(data)
    TotalNum.value = data.total_num;
    data.data.sort((a, b) => {
      return new Date(b.modify_time) - new Date(a.modify_time)
    }).forEach(element => {
      Reply.push(element);
    })
  })
}

onMounted(() => {
  if(!assert()) {
    Router.push('/login');
    return;
  }

  QUERY.get('/api/user/info', {}, 'user_id')
  .then(data => {
    QUERY.set_user_city(data.data.register_city);

    let cities = String(data.data.register_city).split(',')
    UserData.loc1 = cities[0]
    UserData.loc2 = cities[1]
    UserData.phone = data.data.telephone
    UserData.intro = data.data.description ? data.data.description : ''
    resetUpdate();
    resetChange();
  })
  fetchLatest();
  fetchReply();
})
</script>