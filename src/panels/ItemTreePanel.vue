<template>
  <div class="item-tree-panel">
    <el-input class="filter" placeholder="输入关键字进行过滤" v-model="keywords" />
    <div class="item-tree-panel-panel-actions">
      <el-button type="text" icon="el-icon-plus" size="mini" :disabled="!value" @click="newUnit">新建包</el-button>
      <el-button type="text" icon="el-icon-delete" size="mini" :disabled="delDisabled" @click="delUnit"
        >删除包
      </el-button>
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
        @node-drop="nodeDrop"
        :render-content="renderNode"
        highlight-current
        @current-change="nodeChange"
      >
      </el-tree>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import { ElementType, filterNode } from "../utils.js";

export default {
  name: "ItemTreePanel",
  data() {
    return {
      keywords: "",
      filterNode,
      oldTable: null
    };
  },
  inject: ["app"],
  props: {
    value: Object
  },
  computed: {
    ...mapGetters(["tree"]),
    delDisabled() {
      if (!this.value) return true;
      if (this.value.type != ElementType.UNIT) return true;
      if (this.value.children && this.value.children.length > 0) return true;
      return false;
    }
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
    ...mapMutations(["setChanged"]),
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
    allowDrop(draggingNode, dropNode, type) {
      let dragData = draggingNode.data;
      let dropData = dropNode.data;
      if (dragData.type == ElementType.TABLE) {
        if (dropData.type == ElementType.TABLE) return type != "inner";
        else return type == "inner";
      } else {
        return dropData.type != ElementType.TABLE;
      }
    },
    nodeDrop(dragNode, dropNode, type, e) {
      let dragData = dragNode.data;
      let dropData = dropNode.data;
      if (dragData.type == ElementType.TABLE) {
        if (type == "inner") {
          const firstUnit = dropData.children.find(c => c.type == ElementType.UNIT);
          if (firstUnit) {
            this.$refs.tree.remove(dragData);
            this.$refs.tree.insertBefore(dragData, firstUnit);
          }
          dragData.unit = dropData;
        }
      } else if (type == "inner") {
        dragData.parent = dropData;
      }
      this.setChanged(true);
      this.$refs.tree.setCurrentKey(dragData.id);
      this.$emit("input", dragData);
    },
    nodeChange(data) {
      this.$emit("input", data);
    },
    actionClick(action) {
      this[action]();
    },
    newUnit() {
      const parent = this.value.type == ElementType.TABLE ? this.value.unit : this.value;
      this.app.$refs.unitDialog.newUnit(parent);
    },
    delUnit() {
      let inx = this.value.parent.children.indexOf(this.value);
      this.value.parent.children.splice(inx, 1);
    }
  }
};
</script>

<style lang="scss">
.item-tree-panel {
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
  .item-tree-panel-actions {
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
