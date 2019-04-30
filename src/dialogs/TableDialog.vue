<template>
  <el-dialog :title="title" width="500px" :visible.sync="visible">
    <el-form :model="table" :rules="rules" label-width="90px" size="mini" ref="form">
      <el-form-item label="实体对象名">
        <el-input v-model="table.name"></el-input>
      </el-form-item>
      <el-form-item label="显示标题">
        <el-input v-model="table.label"></el-input>
      </el-form-item>
      <el-form-item label="数据库表名">
        <el-input v-model="table.code"></el-input>
      </el-form-item>
      <el-row>
        <template v-for="tag in tableTags">
          <el-col :span="8" v-if="tag.type == 'FLAG'" :key="tag.name">
            <el-form-item :label="tag.name">
              <el-switch v-model="table.tags[tag.name]" />
            </el-form-item>
          </el-col>
        </template>
      </el-row>
      <el-form-item label="描述">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="table.comment" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { uuid, newTable, TagType } from "../utils";

export default {
  name: "TableDialog",
  data() {
    return {
      visible: false,
      title: "",
      unit: null,
      table: { tags: [] },
      oldTable: null,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        label: [{ required: true, message: "请输入显示标题", trigger: "blur" }],
        code: [{ required: true, message: "请输入数据库表名", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState(["world"]),
    ...mapGetters(["model", "tableTags"])
  },
  methods: {
    ...mapMutations(["setChanged"]),
    newTable(unit) {
      this.unit = unit;
      this.title = "新建数据表";
      this.oldTable = null;
      this.table = newTable(this.model);
      this.visible = true;
    },
    editTable(table) {
      this.title = "编辑数据表";
      this.oldTable = table;
      this.table = this._.cloneDeep(table);
      if (this.table.tags == null) this.table.tags = {};
      this.visible = true;
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) this.doSave();
      });
    },
    doSave() {
      if (this.oldTable == null) {
        if (this.table.tags) {
          this.tableTags
            .filter(tag => tag.type == TagType.FLAG)
            .forEach(tag => {
              if (this.table.tags[tag.name]) this.addTagFields(tag);
            });
        }
        this.unit.children.unshift(this.table);
        this.world.tables[this.table.id] = this.table;
      } else {
        this.tableTags
          .filter(tag => tag.type == TagType.FLAG)
          .forEach(tag => {
            if (this.table.tags[tag.name]) this.addTagFields(tag);
            else this.removeTagFields(tag);
          });
        this._.assign(this.oldTable, this.table);
      }
      this.setChanged(true);
      this.visible = false;
    },

    addTagFields(tag) {
      if (this._.isEmpty(tag.fields)) return;
      tag.fields.forEach(field => {
        let one = this.table.fields.find(f => f.name == field.name);
        if (one) return;
        one = this._.clone(field);
        one.id = uuid();
        this.table.fields.push(one);
      });
    },
    removeTagFields(tag) {
      if (this._.isEmpty(tag.fields)) return;
      tag.fields.forEach(field => {
        let inx = this.table.fields.findIndex(f => f.name == field.name);
        if (inx >= 0) this.table.fields.splice(inx, 1);
      });
    }
  }
};
</script>

<style lang="scss">
.el-select {
  display: block !important;
}
</style>
