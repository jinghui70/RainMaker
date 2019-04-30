<template>
  <div class="item-tree">
    <el-input class="filter" placeholder="输入关键字进行过滤" v-model="keywords" />
    <div class="item-tree-actions">
      <el-button type="text" icon="el-icon-plus" size="mini">新建包</el-button>
      <el-button type="text" icon="el-icon-delete" size="mini" :disabled="!value || value.type == 1">删除包</el-button>
      <el-button type="text" icon="el-icon-folder-remove" size="mini">收起</el-button>
    </div>
    <div class="tree-wrapper">
      <el-tree
        :data="tree"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        node-key="id"
        ref="tree"
        draggable
        :allow-drag="allowDrag"
        :allow-drop="allowDrop"
        :render-content="renderNode"
        highlight-current
        @current-change="nodeChange"
      >
      </el-tree>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ElementType, filterNode } from "../utils.js";

export default {
  name: "ItemTree",
  data() {
    return {
      keywords: "",
      filterNode,
      oldTable: null
    };
  },
  props: {
    value: Object
  },
  computed: {
    ...mapGetters(["tree"])
  },
  watch: {
    keywords(val) {
      this.$refs.tree.filter(val);
    },
    value(val) {
      if (val) this.$nextTick(() => this.$refs.tree.setCurrentKey(val.id));
    }
  },
  methods: {
    renderNode(h, { node, data }) {
      let icon = "el-icon-document";
      let label = data.label;
      switch (data.type) {
        case ElementType.MODEL:
          icon = "el-icon-s-home";
          node.expanded = true;
          break;
        case ElementType.UNIT:
          icon = node.expanded ? "el-icon-folder-opened" : "el-icon-folder";
          break;
        default:
          label = `${data.label}-${data.name}`;
          break;
      }
      return (
        <span>
          <i class={icon} /> &nbsp;{label}
        </span>
      );
    },
    allowDrag(node) {
      let data = node.data;
      return data.type != ElementType.MODEL;
    },
    allowDrop(draggingNode, dropNode) {
      //, type) {
      let dragData = draggingNode.data;
      let dropData = dropNode.data;
      return dragData != dropData;
    },
    nodeChange(data) {
      this.$emit("input", data);
    },
    actionClick(action) {
      this[action]();
    }
  }
};
</script>

<style lang="scss">
.item-tree {
  display: flex;
  flex-direction: column;

  .el-input__inner {
    background-color: #3c3c3c;
    color: #c0c4cc;
    border-width: 0;
    &::-webkit-input-placeholder {
      color: #8b8b8b;
    }
  }
  .item-tree-actions {
    background-color: #252526;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 30px;
    font-size: 18px;
    color: #8b8b8b;
  }

  .tree-wrapper {
    background-color: #252526;
    margin-top: 8px;
    flex: 1;
    color: #8b8b8b;
    overflow: scroll;
    .el-tree {
      color: #8b8b8b;
      background-color: #252526 !important;
      cursor: pointer;
    }
    .el-tree-node__content:hover {
      background-color: inherit;
    }
    .is-current > .el-tree-node__content {
      background-color: #35353b !important;
      color: white;
    }
  }
}
</style>
