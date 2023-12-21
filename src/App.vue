<template>
  <v-alert
    closable
    v-model="RefAlert"
    :type="RefType"
    :text="RefText"
    :title="RefTitle"
    min-width="340"
    rounded="lg"
    elevation="10"
    style="position: fixed; bottom: 30px; right: 20px; z-index: 1000;"
  />
  <router-view />
</template>

<script setup>
import {ref} from 'vue'

const RefAlert = ref(false);
const RefType = ref('');
const RefText = ref('');
const RefTitle = ref('');
var timeout_id = null;

function showAlert(title, text, type) {
  setTimeout(()=>{
    if(timeout_id) clearTimeout(timeout_id);
    RefAlert.value = true;
    RefType.value = type;
    RefText.value = text;
    RefTitle.value = title;
    timeout_id = setTimeout(()=>{
      RefAlert.value = false;
      timeout_id = null;
    }, 2200);
  }, 200);
}

window.onerror = function (msg, url, lineNo, columnNo, error) {
  showAlert('错误',String(msg),'error');
  return false;
}

window.addEventListener('glb_info_event', (event) => {
  showAlert('成功', String(event.detail), 'success');
  return true;
})
window.addEventListener('glb_warn_event', (event) => {
  showAlert('提示', String(event.detail), 'warning');
  return true;
})
window.addEventListener('glb_err_event', (event) => {
  showAlert('错误', String(event.detail), 'error');
  return true;
})

window.addEventListener('unhandledrejection', (event) => {
  showAlert('错误',String(event.reason),'error');
  return true;
})
</script>
