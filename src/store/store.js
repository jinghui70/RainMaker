import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fileName: "",
    changed: false,
    model: {},
    tree: [],
    openedItems: []
  },
  getters: {},
  mutations: {
    loadFile(state, payload) {
      state.fileName = payload.fileName;
      state.changed = false;
      state.openedItems = [];
      state.tree = payload.content.tree;
    }
  },
  actions: {}
});
