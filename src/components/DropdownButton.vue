<template>
  <div class="dropdown-button" @mouseenter="popOpen = true" @mouseleave="popOpen = false">
    <slot name="icon" />
    <span class="txt">{{ title }}</span>
    <span class="arrow" v-if="arrow" />
    <div :class="{ popup: true, open: popOpen }" :style="popupStyle">
      <ul>
        <li v-for="(item, index) in list" :key="index" @click="handleSelect(index)">
          {{ item.title || item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "DropdownButton",
  data() {
    return {
      popOpen: false
    };
  },
  computed: {
    title() {
      if (this.fixTitle) return this.fixTitle;
      let item = this.list[this.value];
      return item ? item.title || item.name : this.placeholder;
    },
    popupStyle() {
      let p = this.left ? "left" : "right";
      return { [p]: "0px" };
    }
  },
  props: {
    icon: String,
    value: Number,
    fixTitle: String,
    placeholder: {
      type: String,
      default: "请选择"
    },
    arrow: {
      type: Boolean,
      default: true
    },
    list: {
      type: Array,
      required: true
    },
    left: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleSelect(index) {
      this.popOpen = false;
      if (index != this.value) this.$emit("input", index);
      this.$emit("itemClick", this.list[index]);
    }
  }
};
</script>

<style lang="scss">
.dropdown-button {
  display: flex;
  position: relative;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: white;

  background-color: #1159be;
  &:hover {
    background-color: #4786ff;
  }

  & .txt {
    margin: 0 5px;
  }
  & .arrow {
    display: inline-block;
    position: relative;
    top: 3px;
    width: 0px;
    height: 0px;
    border: 5px solid transparent;
    border-top-color: #e4e4e3;
  }

  & .popup.open {
    display: block;
  }

  & .popup {
    display: none;
    padding-top: 2px;
    position: absolute;
    top: 36px;
    z-index: 10;
    align-self: flex-start;

    & > ul {
      min-width: 120px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 2px 6px 0 rgba(21, 45, 103, 0.68);
      list-style: none;
      padding: 6px 0;
      font-size: 14px;
      color: #5b6373;
      border-radius: 4px;
      & > li {
        height: 32px;
        line-height: 32px;
        padding-left: 20px;
        text-align: left;
        &:hover {
          background: #f5f7fa;
          color: #4786ff;
        }
      }
    }
  }
}
</style>
