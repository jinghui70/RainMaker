<template>
  <div class="el-select" :class="[selectSize ? 'el-select--' + selectSize : '']" @click.stop="openDialog">
    <div
      class="el-select__tags"
      v-if="multiple"
      ref="tags"
      :style="{ 'max-width': inputWidth - 32 + 'px', width: '100%' }"
    >
      <span v-if="collapseTags && selected.length">
        <el-tag
          :closable="!selectDisabled"
          :size="collapseTagSize"
          :hit="selected[0].hitState"
          type="info"
          @close="deleteTag($event, selected[0])"
          disable-transitions
        >
          <span class="el-select__tags-text">{{ selected[0].currentLabel }}</span>
        </el-tag>
        <el-tag v-if="selected.length > 1" :closable="false" :size="collapseTagSize" type="info" disable-transitions>
          <span class="el-select__tags-text">+ {{ selected.length - 1 }}</span>
        </el-tag>
      </span>
      <transition-group @after-leave="resetInputHeight" v-if="!collapseTags">
        <el-tag
          v-for="item in selected"
          :key="getValueKey(item)"
          :closable="!selectDisabled"
          :size="collapseTagSize"
          :hit="item.hitState"
          type="info"
          @close="deleteTag($event, item)"
          disable-transitions
        >
          <span class="el-select__tags-text">{{ item.currentLabel }}</span>
        </el-tag>
      </transition-group>
    </div>
    <el-input
      ref="reference"
      v-model="selectedLabel"
      type="text"
      :placeholder="currentPlaceholder"
      :name="name"
      :id="id"
      :size="selectSize"
      :disabled="selectDisabled"
      :readonly="true"
      :validate-event="false"
      @mouseenter.native="inputHovering = true"
      @mouseleave.native="inputHovering = false"
    >
      <template slot="prefix" v-if="$slots.prefix">
        <slot name="prefix"></slot>
      </template>
      <template slot="suffix">
        <i v-show="!showClose" :class="['el-select__caret', 'el-input__icon', 'el-icon-' + iconClass]"></i>
        <i v-if="showClose" class="el-select__caret el-input__icon el-icon-circle-close" @click="handleClearClick"></i>
      </template>
      <template slot="dialog" />
    </el-input>
  </div>
</template>

<script type="text/babel">
import Emitter from "element-ui/src/mixins/emitter";
import Focus from "element-ui/src/mixins/focus";
import Locale from "element-ui/src/mixins/locale";
import ElInput from "element-ui/packages/input";
import ElTag from "element-ui/packages/tag";
import { addResizeListener, removeResizeListener } from "element-ui/src/utils/resize-event";
import { valueEquals } from "element-ui/src/utils/util";
import NavigationMixin from "./navigation-mixin";

export default {
  mixins: [Emitter, Locale, Focus("reference"), NavigationMixin],

  name: "DialogSelector",

  componentName: "DialogSelector",

  inject: {
    elForm: {
      default: ""
    },

    elFormItem: {
      default: ""
    }
  },

  computed: {
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },

    showClose() {
      let hasValue = this.multiple
        ? Array.isArray(this.value) && this.value.length > 0
        : this.value !== undefined && this.value !== null && this.value !== "";
      return this.clearable && !this.selectDisabled && this.inputHovering && hasValue;
    },

    iconClass() {
      return this.visible ? "arrow-up is-reverse" : "arrow-up";
    },

    selectSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
    },

    selectDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },

    collapseTagSize() {
      return ["small", "mini"].indexOf(this.selectSize) > -1 ? "mini" : "small";
    }
  },

  components: { ElInput, ElTag },

  props: {
    name: String,
    id: String,
    value: {
      required: true
    },
    automaticDropdown: Boolean,
    size: String,
    disabled: Boolean,
    clearable: Boolean,
    noDataText: String,
    multiple: Boolean,
    multipleLimit: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: String,
      default: "请选择"
    },
    valueKey: {
      type: String,
      default: "value"
    },
    collapseTags: Boolean
  },

  data() {
    return {
      options: [],
      cachedOptions: [],
      createdLabel: null,
      createdSelected: false,
      selected: this.multiple ? [] : {},
      inputLength: 20,
      inputWidth: 0,
      initialInputHeight: 0,
      cachedPlaceHolder: "",
      optionsCount: 0,
      visible: false,
      softFocus: false,
      selectedLabel: "",
      inputHovering: false,
      currentPlaceholder: "",
      menuVisibleOnFocus: false,
      isOnComposition: false,
      isSilentBlur: false
    };
  },

  watch: {
    selectDisabled() {
      this.$nextTick(() => {
        this.resetInputHeight();
      });
    },

    placeholder(val) {
      this.cachedPlaceHolder = this.currentPlaceholder = val;
    },

    value(val) {
      if (this.multiple) {
        this.resetInputHeight();
        if (val && val.length > 0) {
          this.currentPlaceholder = "";
        } else {
          this.currentPlaceholder = this.cachedPlaceHolder;
        }
      }
      this.setSelected();
      this.dispatch("ElFormItem", "el.form.change", val);
    },

    visible(val) {
      if (!val) {
        this.broadcast("ElSelectDropdown", "destroyPopper");
        if (this.$refs.input) {
          this.$refs.input.blur();
        }
        this.selectedLabel = "";
        this.inputLength = 20;
        this.menuVisibleOnFocus = false;
        this.$nextTick(() => {
          if (this.$refs.input && this.$refs.input.value === "" && this.selected.length === 0) {
            this.currentPlaceholder = this.cachedPlaceHolder;
          }
        });
        if (!this.multiple) {
          if (this.selected) {
            this.selectedLabel = this.selected.currentLabel;
          }
        }
      } else {
        this.broadcast("ElSelectDropdown", "updatePopper");
      }
      this.$emit("visible-change", val);
    },

    options() {
      if (this.$isServer) return;
      this.$nextTick(() => {
        this.broadcast("ElSelectDropdown", "updatePopper");
      });
      if (this.multiple) {
        this.resetInputHeight();
      }
      let inputs = this.$el.querySelectorAll("input");
      if ([].indexOf.call(inputs, document.activeElement) === -1) {
        this.setSelected();
      }
    }
  },

  methods: {
    emitChange(val) {
      if (!valueEquals(this.value, val)) {
        this.$emit("change", val);
      }
    },

    getOption(value) {
      let option;
      const isObject = Object.prototype.toString.call(value).toLowerCase() === "[object object]";
      const isNull = Object.prototype.toString.call(value).toLowerCase() === "[object null]";

      for (let i = this.cachedOptions.length - 1; i >= 0; i--) {
        const cachedOption = this.cachedOptions[i];
        const isEqual = isObject
          ? getValueByPath(cachedOption.value, this.valueKey) === getValueByPath(value, this.valueKey)
          : cachedOption.value === value;
        if (isEqual) {
          option = cachedOption;
          break;
        }
      }
      if (option) return option;
      const label = !isObject && !isNull ? value : "";
      let newOption = {
        value: value,
        currentLabel: label
      };
      if (this.multiple) {
        newOption.hitState = false;
      }
      return newOption;
    },

    setSelected() {
      if (!this.multiple) {
        let option = this.getOption(this.value);
        this.selectedLabel = option.currentLabel;
        this.selected = option;
        return;
      }
      let result = [];
      if (Array.isArray(this.value)) {
        this.value.forEach(value => {
          result.push(this.getOption(value));
        });
      }
      this.selected = result;
      this.$nextTick(() => {
        this.resetInputHeight();
      });
    },

    handleClearClick(event) {
      this.deleteSelected(event);
    },

    doDestroy() {
      this.$refs.popper && this.$refs.popper.doDestroy();
    },

    managePlaceholder() {
      if (this.currentPlaceholder !== "") {
        this.currentPlaceholder = this.$refs.input.value ? "" : this.cachedPlaceHolder;
      }
    },

    resetInputHeight() {
      if (this.collapseTags) return;
      this.$nextTick(() => {
        if (!this.$refs.reference) return;
        let inputChildNodes = this.$refs.reference.$el.childNodes;
        let input = [].filter.call(inputChildNodes, item => item.tagName === "INPUT")[0];
        const tags = this.$refs.tags;
        const sizeInMap = this.initialInputHeight || 40;
        input.style.height =
          this.selected.length === 0
            ? sizeInMap + "px"
            : Math.max(tags ? tags.clientHeight + (tags.clientHeight > sizeInMap ? 6 : 0) : 0, sizeInMap) + "px";
      });
    },

    getValueIndex(arr = [], value) {
      const isObject = Object.prototype.toString.call(value).toLowerCase() === "[object object]";
      if (!isObject) {
        return arr.indexOf(value);
      } else {
        const valueKey = this.valueKey;
        let index = -1;
        arr.some((item, i) => {
          if (getValueByPath(item, valueKey) === getValueByPath(value, valueKey)) {
            index = i;
            return true;
          }
          return false;
        });
        return index;
      }
    },

    openDialog() {
      if (this.selectDisabled) return;
    },

    deleteSelected(event) {
      event.stopPropagation();
      const value = this.multiple ? [] : null;
      this.$emit("input", value);
      this.emitChange(value);
      this.visible = false;
      this.$emit("clear");
    },

    deleteTag(event, tag) {
      let index = this.selected.indexOf(tag);
      if (index > -1 && !this.selectDisabled) {
        const value = this.value.slice();
        value.splice(index, 1);
        this.$emit("input", value);
        this.emitChange(value);
        this.$emit("remove-tag", tag.value);
      }
      event.stopPropagation();
    },

    onOptionDestroy(index) {
      if (index > -1) {
        this.optionsCount--;
        this.options.splice(index, 1);
      }
    },

    resetInputWidth() {
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
    },

    handleResize() {
      this.resetInputWidth();
      if (this.multiple) this.resetInputHeight();
    }
  },

  created() {
    this.cachedPlaceHolder = this.currentPlaceholder = this.placeholder;
    if (this.multiple && !Array.isArray(this.value)) {
      this.$emit("input", []);
    }
    if (!this.multiple && Array.isArray(this.value)) {
      this.$emit("input", "");
    }

    this.$on("setSelected", this.setSelected);
  },

  mounted() {
    if (this.multiple && Array.isArray(this.value) && this.value.length > 0) {
      this.currentPlaceholder = "";
    }
    addResizeListener(this.$el, this.handleResize);

    const reference = this.$refs.reference;
    if (reference && reference.$el) {
      const sizeMap = {
        medium: 36,
        small: 32,
        mini: 28
      };
      this.initialInputHeight = reference.$el.getBoundingClientRect().height || sizeMap[this.selectSize];
    }
    this.$nextTick(() => {
      if (reference && reference.$el) {
        this.inputWidth = reference.$el.getBoundingClientRect().width;
      }
    });
    this.setSelected();
  },

  beforeDestroy() {
    if (this.$el && this.handleResize) removeResizeListener(this.$el, this.handleResize);
  }
};
</script>
