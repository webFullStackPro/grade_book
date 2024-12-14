import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './theme/index.css'
import VueI18n from 'vue-i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'

import '@/assets/styles/bootstrap.scss'

Vue.config.productionTip = false
// 定义全局变量
Vue.mixin({
  data() {
    return {
      dialogTop: '50px',
      dialogWidth: '80%',
      formLabelWidth: '150px'
    };
  }
});

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'zh', // set locale
  messages: {
    en,
    zh,
  },
});

new Vue({
  router,
  i18n,
  render: h => h(App),
}).$mount('#app')

document.title = i18n.t('title')
