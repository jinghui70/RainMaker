<template>
  <div id="app">
    <item-tree :treeNodeChange="treeNodeChange" />
    <div class="panel">
      <unit-panel v-if="selectUnit" :unit="selectUnit" />
      <table-panel v-if="selectTable" :table="selectTable" />
    </div>
  </div>
</template>

<script>
import { ipcRenderer, remote } from "electron";
import fs from "fs";
import { ModelReader, ElementType } from "./utils.js";
import ItemTree from "@/components/ItemTree.vue";
import UnitPanel from "@/components/UnitPanel.vue";
import TablePanel from "@/components/TablePanel.vue";

export default {
  name: "app",
  components: { ItemTree, UnitPanel, TablePanel },
  data() {
    return {
      selectObject: null
    };
  },
  computed: {
    selectTable() {
      if (!this.selectObject) return null;
      return this.selectObject.type == ElementType.TABLE ? this.selectObject : null;
    },
    selectUnit() {
      if (!this.selectObject) return null;
      return this.selectObject.type == ElementType.UNIT ? this.selectObject : null;
    }
  },
  created() {
    ipcRenderer.on("action", (event, arg) => {
      switch (arg) {
        case "open":
          this.open();
          break;
      }
    });
  },
  methods: {
    treeNodeChange(data) {
      this.selectObject = data;
    },
    askSaveIfNeed() {},
    open() {
      this.askSaveIfNeed();
      let files = remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        filters: [{ name: "Rainbow Data Model Files", extensions: ["rdmx"] }, { name: "All Files", extensions: ["*"] }],
        properties: ["openFile"]
      });
      if (!files) return;
      const fileName = files[0];
      try {
        const content = fs.readFileSync(fileName, "utf8");
        const reader = new ModelReader(JSON.parse(content));
        this.$store.commit("loadFile", { fileName, content: reader });
      } catch (e) {
        this.$message({
          showClose: true,
          message: "文件格式错误" + e,
          type: "error"
        });
      }
    }
  }
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial,
    sans-serif;
  font-weight: normal;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}

#app {
  height: 100vh;
  width: 100vw;
  padding: 8px;
  display: flex;
  background-color: #333333;
  .item-tree {
    min-width: 250px;
  }
  .panel {
    flex: 1;
    margin-left: 8px;
    overflow: hidden;
  }
  .el-table {
    background-color: #252526;
    border-width: 0;
    td,
    th {
      border-color: #333333;
    }
  }
  .el-table,
  .el-table__fixed {
    &::before {
      background-color: transparent;
    }
  }
  .el-table--border:after {
    background-color: #252526;
  }
  .el-table__body,
  .el-table tr {
    background-color: #252526;
    color: #8b8b8b;
    &:hover,
    .hover-row {
      & > td {
        background-color: #333333;
        color: white;
      }
    }
  }
  .header-cell-class {
    background-color: #444444;
    padding: 3px 0;
    color: white;
  }
  .nopadding {
    padding: 0;
  }
}
</style>
