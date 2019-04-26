<template>
  <div class="item-tree">
    <el-input class="filter" placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
    <div class="tree-wrapper">
      <el-tree
        :data="tree"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        ref="tree"
        draggable
        :allow-drag="allowDrag"
        :allow-drop="allowDrop"
        :render-content="renderNode"
        highlight-current
        @current-change="treeNodeChange"
      >
      </el-tree>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { ElementType } from "../utils.js";
export default {
  name: "ItemTree",
  data() {
    return {
      filterText: ""
    };
  },
  props: {
    treeNodeChange: Function
  },
  computed: {
    ...mapState(["tree"])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    renderNode(h, { node, data }) {
      let icon = "el-icon-document";
      switch (data.type) {
        case ElementType.MODEL:
          icon = "el-icon-s-home";
          node.expanded = true;
          break;
        case ElementType.UNIT:
          icon = node.expanded ? "el-icon-folder-opened" : "el-icon-folder";
          break;
      }
      return (
        <span>
          <i class={icon} /> &nbsp;{node.label}
        </span>
      );
    },
    allowDrag(node) {
      let data = node.data;
      return data.type != ElementType.MODEL;
    },
    allowDrop(draggingNode, dropNode, type) {
      let dragData = draggingNode.data;
      let dropData = dropNode.data;
      return dragData != dropData;
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

  .tree-wrapper {
    background-color: #252526;
    margin-top: 8px;
    flex: 1;
    color: #8b8b8b;
    overflow: scroll;
    .el-tree {
      color: #8b8b8b;
      background-color: #252526;
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
