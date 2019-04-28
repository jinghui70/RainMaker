<template>
  <div class="el-tree-select">
    <!-- 下拉文本 -->
    <el-select
      class="el-tree-select-input"
      v-model="labels"
      :disabled="disabled"
      popper-class="select-option"
      ref="select"
      :size="size"
      :popper-append-to-body="false"
      :filterable="false"
      :multiple="multiple"
      clearable
      placeholder="请选择"
      v-popover:popover
      @remove-tag="_selectRemoveTag"
      @clear="_selectClearFun"
      @focus="_popoverShowFun"
    ></el-select>
    <!-- 弹出框 -->
    <el-popover
      :disabled="disabled"
      ref="popover"
      :placement="placement"
      popper-class="el-tree-select-popper"
      :width="width"
      v-model="visible"
      trigger="click"
    >
      <!-- 是否显示搜索框 -->
      <el-input v-if="filterable" v-model="keywords" size="mini" class="input-with-select mb10">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-scrollbar
        tag="div"
        wrap-class="el-select-dropdown__wrap"
        view-class="el-select-dropdown__list"
        class="is-empty"
      >
        <!-- 树列表 -->
        <el-tree
          ref="tree"
          v-show="data.length > 0"
          :filterable="filterable"
          :data="data"
          :draggable="false"
          :show-checkbox="multiple"
          :filter-node-method="filterNodeMethod"
          @node-click="_treeNodeClickFun"
          @check="_treeCheckFun"
        ></el-tree>
        <!-- 暂无数据 -->
        <div v-if="data.length === 0" class="no-data">暂无数据</div>
      </el-scrollbar>
    </el-popover>
  </div>
</template>
<script>
import { on, off } from "element-ui/lib/utils/dom.js";

export default {
  name: "ElTreeSelect",
  props: {
    data: {
      type: Array,
      required: true
    },
    value: {
      type: [Object, Array],
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: "mini"
    },
    canSelect: {
      type: Function,
      default: () => true
    },
    // 是否禁用文本框
    disabled: {
      type: Boolean,
      default: false
    },
    // 弹出框位置
    placement: {
      type: String,
      default: "bottom"
    },
    filterNodeMethod: Function
  },
  data() {
    return {
      keywords: "",
      visible: false, // popover v-model
      width: 150
    };
  },
  computed: {
    labels() {
      if (this.multiple) {
        return this.value.map(item => item.label);
      }
      return this.value == null ? "" : this.value.label;
    }
  },
  mounted() {
    this._updateH();
    this.$nextTick(() => {
      on(document, "mouseup", this._popoverHideFun);
    });
  },
  watch: {
    keywords(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    // 更新popover位置
    _updatePopoverLocationFun() {
      this.$nextTick(() => {
        this.$refs.popover.updatePopper();
      });
    },
    // 树点击
    _treeNodeClickFun(data, node) {
      if (data.disabled) return;
      if (this.multiple) {
        let selected;
        if (node.checked) {
          selected = this.value.filter(item => item != data);
        } else if (this.canSelect(data)) {
          selected = [...this.value, data];
          node.checked = true;
        }
        this._emitFun(selected);
      } else {
        if (this.canSelect(data)) {
          this._emitFun(data);
          this.visible = false;
        }
      }
    },
    // 树勾选
    _treeCheckFun(data, node) {
      let selected = [];
      node.checkedNodes.forEach(item => {
        selected.push(item);
      });
      this._emitFun(selected);
    },
    // 下拉框移除tag时触发
    _selectRemoveTag(tag) {
      let selected = this.value.filter(item => item.label != tag);
      //this.$refs.tree.setCheckedKeys(this.ids);
      this._emitFun(selected);
    },
    // 下拉框清空数据
    _selectClearFun() {
      let selected = this.multiple ? [] : null;
      this._emitFun(selected);
    },
    // 判断类型，抛出当前选中id
    _emitFun(selected) {
      this.$emit("input", selected);
      this._updatePopoverLocationFun();
    },
    // 更新宽度
    _updateH() {
      this.$nextTick(() => {
        this.width = this.$refs.select.$el.getBoundingClientRect().width;
      });
    },
    // 显示弹出框的时候容错，查看是否和el宽度一致
    _popoverShowFun() {
      this._updateH();
    },
    // 判断是否隐藏弹出框
    _popoverHideFun(e) {
      let isInter = e.path.some(list => {
        return list.className && list.className.indexOf("el-tree-select") !== -1;
      });
      if (!isInter) {
        this.visible = false;
      }
    }
  },
  components: {},
  beforeDestroy() {
    off(document, "mouseup", this._popoverHideFun);
  }
};
</script>
<style>
.el-tree-select .select-option {
  display: none !important;
}

.el-tree-select-popper {
  max-height: 400px;
  overflow: auto;
}

.el-tree-select-popper .el-button--small {
  width: 25px !important;
  min-width: 25px !important;
}

.el-tree-select-popper[x-placement^="bottom"] {
  margin-top: 5px;
}

.mb10 {
  margin-bottom: 10px;
}

.no-data {
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  color: #cccccc;
  text-align: center;
}
</style>
