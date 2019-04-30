<template>
  <el-dialog :title="title" width="600px" :visible.sync="visible">
    <el-form :model="index" :rules="rules" label-width="90px" size="mini" ref="form">
      <el-form-item label="索引名称" prop="code">
        <el-input v-model="index.code" />
      </el-form-item>
      <el-form-item label="唯一索引">
        <el-switch v-model="index.unique"></el-switch>
      </el-form-item>
      <el-form-item label="索引字段">
        <el-input type="textarea" :rows="4" v-model="fieldsText" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { ElementType } from "../utils";

export default {
  name: "IndexDialog",
  data() {
    return {
      visible: false,
      title: "",
      table: null,
      oldIndex: null,
      index: {},
      rules: {
        code: [{ required: true, message: "请输入索引名称", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapGetters(["getFields"]),
    fieldsText() {
      if (this.index.fields) return this.index.fields.map(f => `${f.label}-${f.name}`).join("\n");
      else return "";
    }
  },
  methods: {
    ...mapMutations(["setChanged"]),
    newIndex(table, fields) {
      this.title = "新建索引";
      this.oldIndex = null;
      this.table = table;
      this.index = { code: "", unique: false };
      this.index.fields = [...fields];
      this.visible = true;
    },
    editIndex(table, index) {
      this.title = "编辑链接属性";
      this.oldIndex = index;
      this.table = table;
      this.index = {
        code: index.code,
        unique: index.unique,
        fields: this.getFields(table, index.fields)
      };
      this.visible = true;
    },
    canSelect(data) {
      return data && data.type == ElementType.TABLE;
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) this.doSave();
      });
    },
    doSave() {
      if (!this.table.indexes) this.$set(this.table, "indexes", []);
      let index = this.oldIndex;
      if (this.oldIndex == null) {
        index = {};
        this.table.indexes.push(index);
      }
      this._.assign(index, this.index);
      index.fields = index.fields.map(f => f.id);
      this.$refs.form.resetFields();
      this.setChanged(true);
      this.visible = false;
    }
  }
};
</script>
