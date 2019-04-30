<template>
  <el-dialog :title="title" width="400px" :visible.sync="visible">
    <el-form :model="unit" :rules="rules" label-width="90px" size="mini" ref="form">
      <el-form-item label="上级包名" prop="code">
        <el-input :value="parentLabel" readonly />
      </el-form-item>
      <el-form-item label="包名">
        <el-input v-model="unit.label" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapMutations } from "vuex";
import { uuid, ElementType } from "../utils";

export default {
  name: "UnitDialog",
  data() {
    return {
      visible: false,
      title: "",
      unit: {},
      oldUnit: null,
      rules: {
        label: [{ required: true, message: "请输入包名称", trigger: "blur" }]
      }
    };
  },
  computed: {
    parentLabel() {
      return this.unit.parent ? this.unit.parent.label : "";
    }
  },
  methods: {
    ...mapMutations(["setChanged"]),
    newUnit(parent) {
      this.title = "新建包";
      this.oldUnit = null;
      this.unit = { id: uuid(), parent, label: "", type: ElementType.UNIT, children: [] };
      this.visible = true;
    },
    editUnit(unit) {
      this.title = "修改包名称";
      this.oldUnit = unit;
      this.unit = this._.clone(unit);
      this.visible = true;
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) this.doSave();
      });
    },
    doSave() {
      if (this.oldUnit) this.oldUnit.label = this.unit.label;
      else this.unit.parent.children.push(this.unit);
      this.setChanged(true);
      this.visible = false;
    }
  }
};
</script>
