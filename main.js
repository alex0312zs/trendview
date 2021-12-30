import App from './App'
import './static/tab1.css'
import './static/tab2.css'
import './static/reset.css'

import VueI18n from "vue-i18n";
Vue.use(VueI18n);

const i18n = new VueI18n({
    locale: uni.getStorageSync('lang') == (undefined || "" || null) ? "zh" :uni.getStorageSync('lang'),
    messages: {
        zh: require("./static/lang/zh.json"),
        en: require("./static/lang/th.json")
    },
    silentTranslationWarn: true,
});
Vue.prototype._i18n = i18n

import uView from 'uview-ui';

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
	i18n
})
app.$mount()
// #endif
// #ifdef VUE3
import { createSSRApp } from 'vue'

export function createApp() {
  const app = createSSRApp(App)
  return {
    app,
	i18n
  }
}
// #endif

Vue.use(uView);