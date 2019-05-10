<template>
  <div class="table-panel">
    <div class="block table-panel-fields">
      <block-head
        :title="`${table.label} - ${table.name}`"
        :actions="tableActions"
        @action-click="actionClick"
        title-action="editTable"
        goBack
      />
      <div class="table-panel-tag">
        <el-tag v-for="tag in Object.keys(table.tags)" size="mini" :key="tag">{{ tag }}</el-tag>
      </div>
      <el-table
        :data="fields"
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
        <el-table-column label="标签" width="58">
          <template slot-scope="scope">
            <el-tag v-for="tag in Object.keys(scope.row.tags)" size="mini" :key="tag">{{ tag }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="label" label="显示标题" width="160" />
        <el-table-column prop="name" label="属性名" width="140" />
        <el-table-column prop="code" label="字段名" width="160" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="length" label="长度" width="100" />
        <el-table-column prop="precision" label="精度" width="100" />
        <el-table-column prop="key" label="主键" width="49">
          <template slot-scope="scope">
            <el-tag size="mini" type="success" v-if="scope.row.key">是</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="mandatory" label="非空" width="49">
          <template slot-scope="scope">
            <el-tag size="mini" type="danger" v-if="scope.row.mandatory">是</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="height:8px" />
    <div class="table-panel-sub">
      <div class="block sub">
        <block-head title="链接属性" :actions="linkActions" @action-click="actionClick" />
        <el-table
          :data="linkFields"
          height="250"
          :highlight-current-row="false"
          border
          cell-class-name="nopadding"
          header-cell-class-name="header-cell-class"
          @selection-change="linkSelectionChange"
          @row-dblclick="editLink"
        >
          <el-table-column fixed type="selection" :resizable="false" width="38" />
          <el-table-column prop="name" label="属性名" width="120" />
          <el-table-column prop="label" label="显示标题" width="140" />
          <el-table-column prop="many" label="列表" width="49">
            <template slot-scope="scope">
              <i class="el-icon-success" v-if="scope.row.many" />
            </template>
          </el-table-column>
          <el-table-column label="目标表" width="140">
            <template slot-scope="scope">
              <span>{{ getTable(scope.row.targetTable).label || "**" }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="width: 8px;" />
      <div class="block sub">
        <block-head title="索引" :actions="indexActions" @action-click="actionClick" />
        <el-table
          :data="indexes"
          height="250"
          :highlight-current-row="false"
          border
          cell-class-name="nopadding"
          header-cell-class-name="header-cell-class"
          @selection-change="indexSelectionChange"
          @row-dblclick="editIndex"
        >
          <el-table-column fixed type="selection" :resizable="false" width="38" />
          <el-table-column type="index" label="序号" width="50" />
          <el-table-column prop="code" label="索引名" width="190" />
          <el-table-column prop="unique" label="唯一" width="49">
            <template slot-scope="scope">
              <i class="el-icon-success" v-if="scope.row.unique" />
            </template>
          </el-table-column>
          <el-table-column label="属性" width="180">
            <template slot-scope="scope">
              <span>{{ getFieldsLabel(table, scope.row.fields) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <field-dialog ref="FieldDialog" />
    <link-dialog ref="LinkDialog" />
    <index-dialog ref="IndexDialog" />
  </div>
</template>

<script>
import BlockHead from "@/components/BlockHead.vue";
import FieldDialog from "@/dialogs/FieldDialog.vue";
import LinkDialog from "@/dialogs/LinkDialog.vue";
import IndexDialog from "@/dialogs/IndexDialog.vue";
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "TablePanel",
  components: { BlockHead, FieldDialog, LinkDialog, IndexDialog },
  data() {
    return {
      fieldSelection: [],
      linkSelection: [],
      indexSelection: []
    };
  },
  computed: {
    ...mapGetters(["getTable", "getFieldsLabel"]),
    fields() {
      return this.table.fields || [];
    },
    linkFields() {
      return this.table.linkFields || [];
    },
    indexes() {
      return this.table.indexes || [];
    },
    tableActions() {
      const disabled = this.fieldSelection.length == 0;
      return [
        { id: "editField", title: "编辑属性", icon: "el-icon-document-add" },
        { id: "delField", title: "删除属性", icon: "el-icon-delete", disabled },
        { id: "newLink", title: "新建链接属性", icon: "el-icon-link", disabled },
        { id: "newIndex", title: "新建索引", icon: "el-icon-paperclip", disabled }
      ];
    },
    linkActions() {
      return [{ id: "delLink", title: "删除", icon: "el-icon-delete", disabled: this.linkSelection.length == 0 }];
    },
    indexActions() {
      return [{ id: "delIndex", title: "删除", icon: "el-icon-delete", disabled: this.indexSelection.length == 0 }];
    }
  },
  props: {
    table: Object
  },
  inject: ["app"],
  methods: {
    ...mapMutations(["setChanged"]),
    fieldSelectionChange(selection) {
      this.fieldSelection = selection;
    },
    linkSelectionChange(selection) {
      this.linkSelection = selection;
    },
    indexSelectionChange(selection) {
      this.indexSelection = selection;
    },
    actionClick(action) {
      this[action]();
    },
    editField() {
      this.$refs.FieldDialog.open(this.table);
    },
    delField() {
      this.fieldSelection.forEach(field => {
        let inx = this.table.fields.indexOf(field);
        if (inx >= 0) this.table.fields.splice(inx, 1);
      });
      this.setChanged(true);
    },
    editTable() {
      this.app.$refs.tableDialog.editTable(this.table);
    },
    newLink() {
      this.$refs.LinkDialog.newLink(this.table, this.fieldSelection);
    },
    editLink(link) {
      this.$refs.LinkDialog.editLink(this.table, link);
    },
    delLink() {
      this.linkSelection.forEach(link => {
        let inx = this.table.linkFields.indexOf(link);
        if (inx >= 0) this.table.linkFields.splice(inx, 1);
      });
      this.setChanged(true);
    },
    newIndex() {
      this.$refs.IndexDialog.newIndex(this.table, this.fieldSelection);
    },
    editIndex(index) {
      this.$refs.IndexDialog.editIndex(this.table, index);
    },
    delIndex() {
      this.indexSelection.forEach(index => {
        let inx = this.table.indexes.indexOf(index);
        if (inx >= 0) this.table.indexes.splice(inx, 1);
      });
      this.setChanged(true);
    },
    goBack() {
      this.app.selectObject = this.table.unit;
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
  .table-panel-tag {
    display: flex;
  }
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
