<template>
  <el-dialog title="数据模型" :visible.sync="visible">
    <el-form :model="model2" :rules="rules" label-width="90px" size="mini" ref="form">
      <el-form-item label="模型名称">
        <el-input v-model="model2.name"></el-input>
      </el-form-item>
      <el-form-item label="显示标题">
        <el-input v-model="model2.label"></el-input>
      </el-form-item>
      <el-form-item label="数据表标签">
        <el-input :value="tableTags" readonly></el-input>
      </el-form-item>
      <el-form-item label="字段标签">
        <el-input :value="fieldTags" readonly></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="model.comment" />
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

export default {
  name: "ModelDialog",
  data() {
    return {
      visible: false,
      model2: { name: "", label: "" },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        label: [{ required: true, message: "请输入显示标题", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapGetters(["model", "tree"]),
    tableTags() {
      return this.model.tableTags.map(tag => tag.name).join(",");
    },
    fieldTags() {
      return this.model.fieldTags.map(tag => tag.name).join(",");
    }
  },
  methods: {
    ...mapMutations(["setChanged"]),
    open() {
      this.model2.name = this.model.name;
      this.model2.label = this.model.label;
      this.visible = true;
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) this.doSave();
      });
    },
    doSave() {
      this.model.name = this.model2.name;
      this.model.label = this.model2.label;
      this.tree[0].label = this.model.label;
      this.setChanged(true);
      this.visible = false;
    }
  }
};
</script>

<style lang="scss"></style>
