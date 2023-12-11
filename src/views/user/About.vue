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
        <p class="font-weight-bold">
          Travelet 网站建议
        </p>
        <p class="my-1">
          定期检查并更新您的密码
        </p>
        <v-btn color="red" size="small" elevation="0">
          <p class="text-caption font-weight-bold">更改密码</p>
        </v-btn>
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
    
    <!-- profile -->
    <template v-for="(value,label) in InfoLabel">
      <p class="d-flex text-body-2 flex-wrap my-1">
        <strong class="font-weight-black mr-3">
          {{ label }}:
        </strong>
        {{ UserData[value] }}
      </p>
    </template>

    <v-spacer class="my-3" />
    <v-divider class="mb-6" />
    
    <!-- edit profile -->
    <v-btn color="blue-accent-3" class="align-self-start" elevation="0">
      <p class="text-subtitle-1">更新信息</p>
    </v-btn>


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
import { reactive } from 'vue';
import * as QUERY from '@/plugins/query'
import { onMounted } from 'vue';

const UserData = reactive({
  name: QUERY.get_user_name(),
  loc1: '',
  loc2: '',
  id: QUERY.get_user_id(),
  phone: '',
  intro: '',
})

const InfoLabel = {
  联系方式: 'phone',
  个人简介: 'intro'
}

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

onMounted(() => {
  QUERY.get('/api/user/info', {}, 'user_id')
  .then(data => {
    let citys = String(data.data.register_city).split(',')
    UserData.loc1 = citys[0]
    UserData.loc2 = citys[1]
    UserData.phone = data.data.telephone
    UserData.intro = data.data.description ? data.data.description : ''
  })
})
</script>