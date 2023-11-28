<template>
<v-container class="fill-height">
<v-row>
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
</v-row>
</v-container>
</template>

<script setup>
import { reactive } from 'vue';

const ClassDiv = 'd-flex flex-row my-8'
const ClassDesc = 'align-self-end text-h5 font-weight-bold text-grey-darken-2'
const ClassData = 'align-self-end text-h4 font-weight-black'
const AvatarSize = 220;

const UserData = reactive({
  name: 'user',
  loc1: 'province',
  loc2: 'city',
  id: 'uas1-934n-00qw-a1nf',
  phone: '100-3343-5201',
  times : 1,
  seeking : 2,
  welcome : 3,
  intro: '个人简介0123456789-abcdefghijklmnopqrstuvwxyz',
})
</script>