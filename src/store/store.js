import Vue from "vue";
import Vuex from "vuex";
import { ModelObject } from "../model.js";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fileName: null,
    changed: false,
    model: new ModelObject()
  },
  mutations: {
    setFileName(state, fileName) {
      state.fileName = fileName;
    },
    setModel(state, model) {
      state.model = model;
      state.changed = false;
    },
    setChanged(state, changed) {
      state.changed = changed;
    }
  },
  getters: {
    tree(state) {
      return [state.model.root];
    }
  },
  actions: {}
});
