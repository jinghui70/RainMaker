<template>
  <div class="input-tree" v-clickoutside="handleClose">
    <el-input
      @click.native="visible = true"
      v-model="showText"
      placeholder="请输入"
      size="medium"
      clearable
      @clear="clear"
      suffix-icon="el-icon-arrow-down"
    ></el-input>
    <div class="input-tree__popup" v-show="visible">
      <el-tree
        ref="tree"
        :expand-on-click-node="false"
        highlight-current
        :data="data"
        :filter-node-method="filterNode"
        :props="{ label: labelProp }"
        @node-click="selectNode"
      />
    </div>
  </div>
</template>

<script>
import Clickoutside from "element-ui/lib/utils/clickoutside";

export default {
  name: "InputTree",
  directives: { Clickoutside },
  props: {
    data: {
      type: Array,
      required: true
    },
    labelProp: {
      type: String,
      default: "name"
    }
  },
  data() {
    return {
      visible: false,
      showText: "",
      selected: null
    };
  },
  watch: {
    selected(newValue) {
      this.$emit("selected", newValue);
    },
    visible(newValue) {
      if (!newValue && !this.selected) {
        this.showText = "";
      }
    },
    showText(newValue) {
      if (this.selected) {
        const str = this.selected[this.labelProp];
        if (str === newValue) return;
      }
      this.selected = null;
      this.$refs.tree.filter(newValue);
    }
  },
  methods: {
    handleClose() {
      this.visible = false;
    },
    clear() {
      this.selected = null;
      this.showText = "";
    },
    selectNode(data) {
      this.selected = data;
      if (data) this.showText = data[this.labelProp];
      this.visible = false;
    },
    filterNode(value, data) {
      if (!value) return true;
      const str = data[this.labelProp];
      return str.indexOf(value) !== -1;
    }
  }
};
</script>

<style lang="scss">
.input-tree {
  background: white;
  z-index: 10;
  .el-input__inner {
    border: 0px;
    height: 36px;
    line-height: 36px;
  }
  .popup {
    position: absolute;
    background: white;
    border-radius: 5px;
    min-width: 120px;
    max-height: 200px;
  }
}
.input-tree__popup {
  cursor: default;
  background: #fff;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  width: 100%;
  max-height: 200px;
  overflow-y: scroll;
}
</style>
