import { createApp } from 'vue'
import './style.css'
import  App  from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router/index.js'
import { createPinia } from 'pinia'
const app = createApp(App)
import $ from 'jquery'

// main.ts


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

const pinia = createPinia();


import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' //引入持久化插件


pinia.use(piniaPluginPersistedstate) //将插件添加到 pinia 实例上




app.use(router)
app.use(ElementPlus)
app.use(pinia)
app.mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })

})








