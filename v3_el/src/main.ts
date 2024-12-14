import './assets/main.css'

import { createApp, reactive } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n'

const app = createApp(App)

// 定义全局变量
const globalState = reactive({
  dialogTop: '50px',
  dialogWidth: '80%',
  formLabelWidth: '150px'
})

// 提供全局变量
app.provide('globalState', globalState);

app.use(i18n);

app.use(router)

app.use(ElementPlus)

document.title = i18n.global.t('title')

app.mount('#app')
