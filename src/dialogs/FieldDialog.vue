<template>
  <el-dialog :title="title" width="800px" :visible.sync="visible">
    <el-row>
      <el-col :span="6">
        <div class="field-list">
          <el-table
            :data="fields"
            height="100%"
            highlight-current-row
            cell-class-name="nopadding"
            header-cell-class-name="header-cell-class"
            @current-change="tableSelectionChange"
            :current-row-key="currentKey"
          >
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column label="属性">
              <template slot-scope="scope">
                <span>{{ scope.row.label }}-{{ scope.row.name }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="18">
        <el-form :model="field" label-width="90px" size="mini">
          <el-row>
            <el-col :span="12">
              <el-form-item label="属性名">
                <el-input v-model="field.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="显示标题">
                <el-input v-model="field.label"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="字段名">
                <el-input v-model="field.code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="主键">
                <el-switch v-model="field.key" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="非空">
                <el-switch v-model="field.mandatory" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="描述">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="field.comment" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">完成</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { newField } from "../utils";

export default {
  name: "FieldDialog",
  data() {
    return {
      visible: false,
      title: "",
      unit: null,
      fields: [],
      field: null
    };
  },
  computed: {
    ...mapGetters(["fieldTags"]),
    currentKey() {
      return this.field ? this.field.id : "";
    }
  },
  methods: {
    ...mapMutations(["setChanged"]),
    open(table) {
      this.fields = table.fields;
      if (this.fields.length == 0) {
        this.fields.push(newField());
      }
      this.field = this.fields[0];
      this.title = `编辑属性-${table.label}`;
      this.visible = true;
    },
    tableSelectionChange(row) {
      this.field = row;
    }
  }
};
</script>

<style lang="scss">
.field-list {
  display: flex;
  overflow: scroll;
  max-height: 500px;
}
</style>
