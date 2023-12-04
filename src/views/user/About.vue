<template>
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
</template>

<script setup>
import { reactive } from 'vue';

const UserData = reactive({
  name: 'Zahnarzt Wernitz',
  loc1: '北京市',
  loc2: '海淀区',
  id: 'uas1-934n-00qw-a1nf',
  phone: '100-3343-5201',
  times : 1,
  seeking : 2,
  welcome : 3,
  intro: '个人简介0123456789-abcdefghijklmnopqrstuvwxyz',
})

const InfoLabel = {
  联系方式: 'phone',
  寻去处: 'seeking',
  欢迎来: 'welcome',
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

{/* <v-row>
  <!-- profile -->
  <v-col cols="4">
    <div>
      <!-- avatar image -->
      <v-card rounded="circle" :width="AvatarSize" :height="AvatarSize" class="d-flex" elevation="3">
        <v-avatar :size="AvatarSize * 0.98" class="ma-auto" color="grey">
          <span class="text-h1"> {{ UserData.name[0] }}</span>
        </v-avatar>
      </v-card>

      <!-- user name and id-->
      <div class="ml-1 mt-2">
        <p class="text-h5 font-weight-black">{{ UserData.name }}</p>
        <p class="text-body-2 font-weight-regular text-grey">{{ UserData.id }}</p>
        <!-- location -->
        <div class="d-flex flex-row mt-w">
          <v-icon class="align-self-center" size="small" color="grey">mdi-map-marker-circle</v-icon>
          <p class="ml-2 text-subtitle-1 font-weight-bold align-self-center text-grey-darken-2">
            {{ UserData.loc1 }}, {{ UserData.loc2 }}
          </p>
        </div>
        <!-- contact -->
        <div class="d-flex flex-row">
          <v-icon class="align-self-center" size="small" color="grey">mdi-cellphone-link</v-icon>
          <p class="ml-2 text-body-1 font-weight-bold align-self-center text-grey-darken-2">
            {{ UserData.phone }}
          </p>
        </div>
      </div>
      
      <!-- user infomation -->
      <div class="mt-4">
        <v-btn :width="AvatarSize" rounded="lg" variant="outlined" color="grey-lighten-1" style="background-color: #FAFAFA;">
          <v-icon color="black">mdi-pencil-outline</v-icon>
          <p class="text-body-2 ml-1 text-black">编辑信息</p>
        </v-btn>
      </div>

      <div class="mt-3" :width="AvatarSize">
        <p class="text-h6 text-grey font-weight-bold">用户简介</p>
        <p class="text-body-2">
          {{ UserData.intro }}
        </p>
      </div>
    </div>
  </v-col>

  <v-col cols="1"></v-col>
  <!-- statistic -->
  <v-col cols="5">
    <v-card variant="text">
      <div :class="ClassDiv">
        <p :class="ClassDesc">用户</p>
        <p :class="ClassData" class="mx-2">{{ UserData.name }} ,</p>
      </div>
      <div :class="ClassDiv">
        <p :class="ClassDesc">加入Travelet已经</p>
        <p :class="ClassData" class="mx-2 text-blue-accent-2">{{ UserData.times }}</p>
        <p :class="ClassDesc">天</p>
      </div>
      <div :class="ClassDiv">
        <p :class="ClassDesc">累计发布</p>
        <p :class="ClassData" class="mx-2 text-blue-accent-2">{{ UserData.seeking }}</p>
        <p :class="ClassDesc">条 “寻去处” 消息</p>
      </div>
      <div :class="ClassDiv">
        <p :class="ClassDesc">累计完成</p>
        <p :class="ClassData" class="mx-2 text-blue-accent-2">{{ UserData.welcome }}</p>
        <p :class="ClassDesc">次 “欢迎来” 响应</p>
      </div>
    </v-card>
  </v-col>
</v-row> */}
</script>