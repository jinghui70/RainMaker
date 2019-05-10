<template>
  <div id="app">
    <item-tree-panel v-model="selectObject" />
    <div class="panel">
      <template v-if="selectUnit">
        <unit-panel :unit="selectUnit" />
      </template>
      <template v-else-if="selectTable != null">
        <table-panel :table="selectTable" />
      </template>
    </div>
    <table-dialog ref="tableDialog" />
    <unit-dialog ref="unitDialog" />
    <model-dialog ref="modelDialog" />
  </div>
</template>

<script>
import { ipcRenderer, remote } from "electron";
import fs from "fs";
import { ElementType } from "./utils.js";
import { ModelObject } from "./model.js";
import ItemTreePanel from "@/panels/ItemTreePanel.vue";
import UnitPanel from "@/panels/UnitPanel.vue";
import TablePanel from "@/panels/TablePanel.vue";
import TableDialog from "@/dialogs/TableDialog.vue";
import UnitDialog from "@/dialogs/UnitDialog.vue";
import ModelDialog from "@/dialogs/ModelDialog.vue";
import { mapState, mapMutations } from "vuex";
import pkg from "../package.json";
const version = pkg.version;

export default {
  name: "app",
  components: { ItemTreePanel, UnitPanel, TablePanel, TableDialog, UnitDialog, ModelDialog },
  data() {
    return {
      selectObject: null
    };
  },
  provide() {
    return { app: this };
  },
  computed: {
    ...mapState(["changed", "fileName", "world"]),
    selectTable() {
      if (!this.selectObject) return null;
      return this.selectObject.type == ElementType.TABLE ? this.selectObject : null;
    },
    selectUnit() {
      if (!this.selectObject) return null;
      return this.selectObject.type == ElementType.TABLE ? null : this.selectObject;
    }
  },
  created() {
    ipcRenderer.on("action", (event, arg) => {
      if (this._.isFunction(this[arg])) this[arg]();
    });
  },
  watch: {
    world(newValue) {
      this.selectObject = newValue.root;
    }
  },
  methods: {
    ...mapMutations(["setFileName", "setWorld", "setChanged"]),
    askSaveIfNeed() {
      if (!this.changed) return;
      const response = remote.dialog.showMessageBox(remote.getCurrentWindow(), {
        message: "文件已被改变，需要保存吗？",
        type: "question",
        buttons: ["保存", "不保存"]
      });
      if (response == 0) this.save(); //点击Yes按钮后保存当前文档
    },
    newFile() {
      this.askSaveIfNeed();
      const model = new ModelObject();
      this.setWorld(model);
      this.setFileName(null);
      document.title = "Rainbow Data Model Designer";
    },
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
        const file = JSON.parse(content);
        if (this.checkVersion(file.version)) {
          this.$alert(`程序版本${version}低于文件版本${file.version}，请升级!`, "打开文件失败", {
            confirmButtonText: "确定"
          });
        }
        const world = new ModelObject();
        world.loadFromFile(file);
        this.setFileName(fileName);
        this.setWorld(world);
        document.title = fileName;
      } catch (e) {
        this.$alert(e, "文件格式错误", {
          confirmButtonText: "确定"
        });
      }
    },
    checkVersion(fv) {
      if (!fv) return false;
      if (fv == version) return false;
      var arr1 = fv.split("."),
        arr2 = version.split(".");
      var minLength = Math.min(arr1.length, arr2.length),
        position = 0,
        diff = 0;
      //依次比较版本号每一位大小，当对比得出结果后跳出循环（后文有简单介绍）
      while (position < minLength && (diff = parseInt(arr1[position]) - parseInt(arr2[position])) == 0) {
        position++;
      }
      diff = diff != 0 ? diff : arr1.length - arr2.length;
      //若curV大于reqV，则返回true
      return diff > 0;
    },
    save() {
      if (this.fileName == null) this.saveAs();
      else this.doSave(this.fileName);
    },
    saveAs() {
      const file = remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
        filters: [{ name: "Rainbow Data Model Files", extensions: ["rdmx"] }, { name: "All Files", extensions: ["*"] }]
      });
      if (file) {
        this.doSave(file);
        this.setFileName(file);
      }
    },
    doSave(file) {
      let obj = this.world.toFileObject();
      obj.version = version;
      fs.writeFileSync(file, JSON.stringify(obj, null, "\t"));
      this.setChanged(false);
      this.$message({
        message: "文件保存成功",
        type: "success"
      });
    },
    close() {
      this.askSaveIfNeed();
      ipcRenderer.send("doClose");
    },
    about() {
      remote.dialog.showMessageBox({
        title: "RainMaker",
        message: "Rainbow Data Model Designer",
        detail: `Version: ${version}\nAuthor: jinghui70\nGithub: https://github.com/jinghui70/RainMaker`
      });
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
    min-width: 280px;
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

    :not(.current-row) {
      &:hover,
      &.hover-row {
        & > td {
          background-color: #333333;
          color: white;
        }
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
