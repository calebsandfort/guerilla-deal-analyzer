import "./config";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store/";
import apolloProvider from "./apollo";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import * as VueGoogleMaps from "vue2-google-maps";

Vue.config.productionTip = false;

Vue.use(VueGoogleMaps, {
  load: {
    //key: process.env.GOOGLE_MAPS_API_KEY
    key: "AIzaSyCt4fboH05YC_J8LS0wQZap6cGThoDWdi0"
  }
});

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App)
}).$mount("#app");
