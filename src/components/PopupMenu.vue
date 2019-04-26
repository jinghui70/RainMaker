<script>
export default {
  name: "PopupMenu",
  props: {
    data: { type: Array, required: true }
  },
  render(h) {
    let menu = this.createMenu(h, this.data, "");
    return (
      <el-menu collapse class="popup-menu">
        {menu}
      </el-menu>
    );
  },
  methods: {
    createMenu(h, data, parentIndex) {
      let i = 1;
      data.map(item => {
        let index = `${parentIndex}${i}`;
        if (item.children) {
          return this.createMenu(h, item.children, index);
        }
        let props = this._.pick(item, "disabled");
        return h("el-menu-item", { props, key: index, on: { click: this.handleClick(item) } }, item.title);
      });
    },
    handleClick(item) {
      this.$emit("action-click", item.id);
    }
  }
};
</script>
<style lang="scss">
.popup-menu {
  .el-menu-item,
  .el-submenu__title {
    height: 30px;
    line-height: 30px;
  }
  .el-submenu .el-menu-item {
    height: 30px;
    line-height: 30px;
  }
  .el-menu-item:hover {
    background-color: #f5f7fa;
    color: #4786ff;
  }
}
</style>
