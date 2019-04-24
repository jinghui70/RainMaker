import Vue from "vue";
import App from "./App.vue";
import store from "./store/store";
import "./plugins/element.js";
import i18n from "./plugins/i18n";

Vue.config.productionTip = false;

new Vue({
  store,
  i18n,

  render: function(h) {
    return h(App);
  }
}).$mount("#app");
