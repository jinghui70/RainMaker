<template>
  <div class="unit-panel">
    <block-head :title="unit.label" :actions="actions" />
    <div class="unit-panel-table">
      <el-table
        :data="unit.children || []"
        height="100%"
        :highlight-current-row="false"
        cell-class-name="nopadding"
        header-cell-class-name="header-cell-class"
      >
        <el-table-column fixed type="index" label="序号" width="50" />
        <el-table-column prop="code" label="数据表名" width="160" />
        <el-table-column prop="label" label="标题" width="160" />
        <el-table-column prop="name" label="实体对象名" width="140" />
      </el-table>
    </div>
  </div>
</template>

<script>
import BlockHead from "./BlockHead.vue";
export default {
  name: "UnitPanel",
  components: { BlockHead },
  computed: {
    actions() {
      return [
        { id: "newTable", title: "新建数据表", icon: "el-icon-document" },
        { id: "delTable", title: "删除数据表", icon: "el-icon-delete" },
        { id: "newUnit", title: "新建下级包", icon: "el-icon-folder" }
      ];
    }
  },
  props: {
    unit: Object
  },
  methods: {}
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
