<template>
  <div class="table-panel">
    <div class="block table-panel-fields">
      <block-head :title="`${table.label} - ${table.name}`" :actions="tableActions" @action-click="actionClick" />
      <el-table
        :data="table.fields || []"
        height="250"
        :highlight-current-row="false"
        border
        cell-class-name="nopadding"
        header-cell-class-name="header-cell-class"
        @selection-change="fieldSelectionChange"
        ref="fieldsTable"
      >
        <el-table-column fixed type="selection" :resizable="false" width="38" />
        <el-table-column fixed type="index" label="序号" width="50" />
        <el-table-column prop="code" label="字段名" width="160" />
        <el-table-column prop="label" label="标题" width="160" />
        <el-table-column prop="name" label="属性" width="140" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="length" label="长度" width="100" />
        <el-table-column prop="precision" label="精度" width="100" />
        <el-table-column prop="key" label="主键" width="49">
          <template slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.key" />
          </template>
        </el-table-column>
        <el-table-column prop="mandatory" label="非空" width="49">
          <template slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.mandatory" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height:8px" />
    <div class="table-panel-sub">
      <div class="block sub">
        <block-head title="链接属性" :actions="linkActions" @action-click="actionClick" />
        <el-table
          :data="table.linkFields || []"
          height="250"
          :highlight-current-row="false"
          border
          cell-class-name="nopadding"
          header-cell-class-name="header-cell-class"
          @selection-change="linkSelectionChange"
        >
          <el-table-column fixed type="selection" :resizable="false" width="38" />
          <el-table-column prop="name" label="属性" width="80" />
          <el-table-column prop="label" label="标题" width="80" />
          <el-table-column prop="many" label="[ ]" width="49">
            <template slot-scope="scope">
              <i class="el-icon-success" v-if="scope.row.many" />
            </template>
          </el-table-column>
          <el-table-column prop="targetTable.name" label="目标表" width="100" />
        </el-table>
      </div>
      <div style="width: 8px;" />
      <div class="block sub">
        <block-head title="索引" :actions="indexActions" @action-click="actionClick" />
        <el-table
          :data="table.indexes || []"
          height="250"
          :highlight-current-row="false"
          border
          cell-class-name="nopadding"
          header-cell-class-name="header-cell-class"
        >
          <el-table-column fixed type="selection" :resizable="false" width="38" />
          <el-table-column type="index" width="50" />
          <el-table-column prop="name" label="属性" width="180" />
        </el-table>
      </div>
    </div>
    <link-dialog ref="LinkDialog" />
  </div>
</template>

<script>
import BlockHead from "@/components/BlockHead.vue";
import LinkDialog from "@/dialogs/LinkDialog.vue";
export default {
  name: "TablePanel",
  components: { BlockHead, LinkDialog },
  data() {
    return {
      fieldSelection: [],
      linkSelection: []
    };
  },
  computed: {
    tableActions() {
      const disabled = this.fieldSelection.length == 0;
      return [
        { id: "newField", title: "新建属性", icon: "el-icon-document-add" },
        { id: "delField", title: "删除属性", icon: "el-icon-delete", disabled },
        { id: "newLink", title: "新建链接属性", icon: "el-icon-link", disabled },
        { id: "newIndex", title: "新建索引", icon: "el-icon-paperclip", disabled }
      ];
    },
    linkActions() {
      return [
        { id: "editLink", title: "编辑", icon: "el-icon-edit", disabled: this.linkSelection.length != 1 },
        { id: "delLink", title: "删除", icon: "el-icon-delete", disabled: this.linkSelection.length == 0 }
      ];
    },
    indexActions() {
      return [{ id: "delIndex", title: "删除", icon: "el-icon-delete" }];
    }
  },
  props: {
    table: Object
  },
  methods: {
    fieldSelectionChange(selection) {
      this.fieldSelection = selection;
    },
    linkSelectionChange(selection) {
      this.linkSelection = selection;
    },
    actionClick(action) {
      switch (action) {
        case "newLink":
          this.$refs.LinkDialog.newLink(this.table, this.fieldSelection);
          break;
        case "editLink":
          this.$refs.LinkDialog.editLink(this.table, this.linkSelection[0]);
          break;
      }
    }
  }
};
</script>

<style lang="scss">
.table-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  .table-panel-fields {
    flex: 1;
    overflow: scroll;
  }
  .table-panel-sub {
    height: 200px;
    width: 100%;
    display: flex;
    .sub {
      flex: 1;
      overflow: hidden;
    }
  }
  .block {
    display: flex;
    flex-direction: column;
  }
}
</style>
