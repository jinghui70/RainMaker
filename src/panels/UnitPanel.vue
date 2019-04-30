<template>
  <div class="unit-panel">
    <block-head :title="unit.label" :actions="actions" @action-click="actionClick" title-action="editUnit" />
    <div class="unit-panel-table">
      <el-table
        :data="tables"
        height="100%"
        :highlight-current-row="false"
        cell-class-name="nopadding"
        header-cell-class-name="header-cell-class"
        @selection-change="tableSelectionChange"
        @row-dblclick="editTable"
      >
        <el-table-column fixed type="selection" :resizable="false" width="38" />
        <el-table-column fixed type="index" label="序号" width="50" />
        <el-table-column prop="code" label="数据表名" width="160" />
        <el-table-column prop="label" label="标题" width="160" />
        <el-table-column prop="name" label="实体对象名" width="140" />
      </el-table>
    </div>
  </div>
</template>

<script>
import BlockHead from "@/components/BlockHead.vue";
import { ElementType } from "../utils";
import { remote } from "electron";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "UnitPanel",
  components: { BlockHead },
  data() {
    return {
      tableSelection: []
    };
  },
  computed: {
    ...mapGetters(["tableMap"]),
    actions() {
      return [
        { id: "newTable", title: "新建数据表", icon: "el-icon-document" },
        { id: "delTable", title: "删除数据表", icon: "el-icon-delete", disabled: this.tableSelection.length == 0 }
      ];
    },
    tables() {
      return this.unit.children.filter(child => child.type == ElementType.TABLE);
    }
  },
  props: {
    unit: Object
  },
  inject: ["app"],
  methods: {
    ...mapMutations(["setChanged"]),
    tableSelectionChange(selection) {
      this.tableSelection = selection;
    },
    actionClick(action) {
      this[action]();
    },
    editUnit() {
      if (this.unit.type == ElementType.UNIT) this.app.$refs.unitDialog.editUnit(this.unit);
    },
    newTable() {
      this.app.$refs.tableDialog.newTable(this.unit);
    },
    editTable(table) {
      //this.app.$refs.tableDialog.editTable(table);
      this.app.selectObject = table;
    },
    delTable() {
      const response = remote.dialog.showMessageBox(remote.getCurrentWindow(), {
        message: "确定要删除选中的数据表吗？",
        type: "question",
        buttons: ["确定", "取消"]
      });
      if (response == 0) {
        this.tableSelection.forEach(table => {
          delete this.tableMap[table.id];
          let inx = this.unit.children.indexOf(table);
          if (inx >= 0) this.unit.children.splice(inx, 1);
        });
        this.setChanged(true);
      }
    }
  }
};
</script>

<style lang="scss">
.unit-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  .unit-panel-table {
    flex: 1;
    overflow: scroll;
  }
}
</style>
