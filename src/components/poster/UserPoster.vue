<template>
  <v-card color="white" width="400" rounded="lg" class="pa-1">
    <v-card-title class="d-flex align-end">
      <p class="text-overline font-weight-bold">UID: {{ Data.uid }}</p>
      <p class="text-overline ml-auto font-weight-medium text-grey-darken-1"> {{ Data.time }} </p>
    </v-card-title>

    <v-card-text class="text-subtitle-1 py-2">
      <span class="d-block text-truncate">
        {{ Data.intro }}
      </span>
    </v-card-text>

    <v-card-actions>
      <v-list-item class="w-100">
        <template v-slot:prepend>
          <v-icon size="large" :color="Data.is_admin ? 'red' : 'blue-accent-3'">
            mdi-account
          </v-icon>
        </template>
        <v-list-item-title>{{ Data.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ Data.city }}</v-list-item-subtitle>
        <template v-slot:append>
          <div class="d-flex align-end justify-end pt-3">
            <v-icon size="20">mdi-phone-outline</v-icon>
            <p class="text-body-2 ml-1">{{ Data.phone }}</p>
          </div>
        </template>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { reactive, onMounted } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const Data = reactive({
  name: '',
  uid: '',
  phone: '',
  city: '',
  time: '',
  intro: '',
  is_admin: false,
})

onMounted(()=>{
  Data.is_admin = props.data.is_admin;
  Data.name = props.data.username;
  Data.uid = props.data.id;
  Data.city = String(props.data.register_city)
  Data.time = props.data.register_time,
  Data.phone = props.data.telephone
  Data.intro = props.data.description ? props.data.description : ''
})

</script>