<template>
  <el-dialog :title="title" width="600px" :visible.sync="visible">
    <el-form :model="link" :rules="rules" label-width="90px" size="mini" ref="form">
      <el-row>
        <el-col :span="12">
          <el-form-item label="属性名称" prop="name">
            <el-input v-model="link.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示标题" prop="label">
            <el-input v-model="link.label" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="列表属性">
            <el-switch v-model="link.many"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="有中间表">
            <el-switch v-model="hasInterTable"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <template v-if="hasInterTable">
        <el-row>
          <el-col :span="24">
            <el-form-item label="中间表">
              <el-tree-select
                v-model="interTable"
                :data="tree"
                :filter-node-method="filterNode"
                :can-select="canSelect"
                key="interTable"
                ref="interTable"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-for="(field, index) in link.fields" :key="field.id">
          <el-col :span="12">
            <el-form-item label="字段">
              <el-input :value="`${field.label}-${field.name}`" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中间表字段">
              <el-select v-model="link.leftFields[index]" placeholder="请选择">
                <el-option
                  v-for="item in interTableFields"
                  :key="item.id"
                  :label="`${item.label}-${item.name}`"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <el-row>
        <el-col :span="24">
          <el-form-item label="目标表" prop="targetTable">
            <el-tree-select
              v-model="targetTable"
              :data="tree"
              :filter-node-method="filterNode"
              :can-select="canSelect"
              key="targetTable"
              ref="targetTable"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <template v-if="hasInterTable">
        <el-col :span="12">
          <el-form-item label="中间表字段">
            <el-select v-model="link.rightFields[0]" placeholder="请选择">
              <el-option
                v-for="item in interTableFields"
                :key="item.id"
                :label="`${item.label}-${item.name}`"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目标表字段">
            <el-select v-model="link.targetFields[0]" placeholder="请选择">
              <el-option
                v-for="item in targetTableFields"
                :key="item.id"
                :label="`${item.label}-${item.name}`"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </template>
      <template v-else>
        <el-row v-for="(field, index) in link.fields" :key="field.name">
          <el-col :span="12">
            <el-form-item label="字段">
              <el-input :value="`${field.label}-${field.name}`" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标表字段">
              <el-select v-model="link.targetFields[index]" placeholder="请选择">
                <el-option
                  v-for="item in targetTableFields"
                  :key="item.id"
                  :value-key="item.name"
                  :label="`${item.label}-${item.name}`"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { filterNode } from "@/utils.js";
import ElTreeSelect from "@/components/ElTreeSelect.vue";
import { ElementType, newLink } from "../utils";

export default {
  name: "LinkDialog",
  components: { ElTreeSelect },
  data() {
    return {
      visible: false,
      title: "",
      hasInterTable: false,
      table: null,
      oldLink: null,
      link: newLink([]),
      filterNode,
      rules: {
        name: [{ required: true, message: "请输入属性名称", trigger: "blur" }],
        label: [{ required: true, message: "请输入显示标题", trigger: "blur" }],
        targetTable: [{ required: true, message: "请选择目标表", trigger: "change" }]
      }
    };
  },
  watch: {
    hasInterTable(newValue) {
      if (!newValue) this.interTable = null;
    }
  },
  computed: {
    ...mapGetters(["tree", "getTable", "getFields"]),
    interTable: {
      get() {
        return this.getTable(this.link.interTable);
      },
      set(value) {
        this.link.interTable = value.id;
        this.link.leftFields = [];
        this.link.rightFields = [];
      }
    },
    targetTable: {
      get() {
        return this.getTable(this.link.targetTable);
      },
      set(value) {
        this.link.targetTable = value.id;
        this.link.targetFields = [];
      }
    },
    interTableFields() {
      if (this.link.interTable) {
        return this.interTable.fields;
      } else return [];
    },
    targetTableFields() {
      if (this.link.targetTable) {
        return this.targetTable.fields;
      } else return [];
    }
  },
  methods: {
    ...mapMutations(["setChanged"]),
    newLink(table, fields) {
      this.title = "新建链接属性";
      this.table = table;
      this.oldLink = null;
      this.link = newLink(fields);
      this.hasInterTable = false;
      this.visible = true;
    },
    editLink(table, link) {
      this.title = "编辑链接属性";
      this.oldLink = link;
      this.table = table;
      this.link.fields = this.getFields(table, link.fields);
      this.link.name = link.name;
      this.link.label = link.label;
      this.link.many = link.many;
      this.hasInterTable = !!link.interTable;
      this.link.interTable = link.interTable || null;
      if (this.hasInterTable) {
        this.link.leftFields = [...link.leftFields];
        this.link.rightFields = [...link.rightFields];
      } else {
        this.link.leftFields = [];
        this.link.rightFields = [];
      }
      this.link.targetTable = link.targetTable;
      this.link.targetFields = [...link.targetFields];
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
      if (!this.table.linkFields) this.$set(this.table, "linkFields", []);
      let link = this.oldLink;
      if (this.oldLink == null) {
        link = {};
        this.table.linkFields.push(link);
      }
      this._.assign(link, this.link);
      link.fields = link.fields.map(f => f.id);
      if (!this.hasInterTable) {
        delete link.interTable;
        delete link.leftFields;
        delete link.rightFields;
      }
      this.$refs.form.resetFields();
      this.setChanged(true);
      this.visible = false;
    }
  }
};
</script>

<style lang="scss">
.el-select {
  display: block !important;
}
</style>
