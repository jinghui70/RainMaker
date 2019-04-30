import Vue from "vue";
import Vuex from "vuex";
import { ModelObject } from "../model.js";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fileName: null,
    changed: false,
    world: new ModelObject()
  },
  mutations: {
    setFileName(state, fileName) {
      state.fileName = fileName;
    },
    setWorld(state, world) {
      state.world = world;
      state.changed = false;
    },
    setChanged(state, changed) {
      state.changed = changed;
    }
  },
  getters: {
    model(state) {
      return state.world.model;
    },
    tree(state) {
      return [state.world.root];
    },
    tableTags(state, getters) {
      return getters.model.tableTags;
    },
    fieldTags(state, getters) {
      return getters.model.fieldTags;
    },
    tableMap(state) {
      return state.world.tables;
    },
    getTable(state) {
      return function(id) {
        return state.world.tables[id];
      };
    },
    getFields(state) {
      return function(table, fields) {
        return fields.map(f => state.world.fieldId2Field(table, f));
      };
    },
    getFieldsLabel(state) {
      return function(table, fields) {
        return fields.map(f => state.world.fieldId2FieldName(table, f)).join(",");
      };
    }
  },
  actions: {}
});
