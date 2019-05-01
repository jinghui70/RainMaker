<template>
  <el-dialog class="field-dialog" :title="title" fullscreen :visible.sync="visible">
    <div class="field-dialog-list">
      <div class="field-actions">
        <el-button type="text" icon="el-icon-plus" @click="addField" />
        <el-button type="text" icon="el-icon-delete" @click="delField" />
        <el-button type="text" icon="el-icon-top" @click="moveUp" />
        <el-button type="text" icon="el-icon-bottom" @click="moveDown" />
      </div>
      <el-table
        class="field-list"
        :data="fields"
        height="100%"
        highlight-current-row
        cell-class-name="nopadding"
        header-cell-class-name="header-cell-class"
        @current-change="fieldChange"
        ref="fieldList"
      >
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column label="属性">
          <template slot-scope="scope">
            <span>{{ scope.row.label }}-{{ scope.row.name }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-form class="field-form" :model="field" label-width="90px" size="mini">
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
      <el-row>
        <el-col :span="12">
          <el-form-item label="数据类型">
            <el-select v-model="field.type">
              <el-option v-for="item in dataTypes" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="长度">
            <el-input-number v-model="field.length" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="精度">
            <el-input-number v-model="field.precision" :min="0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <template v-for="tag in fieldTags">
          <el-col :span="12" :key="tag.name">
            <el-form-item :label="tag.name" :class="{ ['extra-input']: tag.type != 'FLAG' && tagStatus[tag.name] }">
              <el-switch v-model="tagStatus[tag.name]" @input="e => setTagStatus(tag, e)" />
              <template v-if="tag.type == 'STRING'">
                <el-input v-if="tagStatus[tag.name]" v-model="field.tags[tag.name]" />
              </template>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
      <el-form-item label="描述">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="field.comment" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { newField, swapArray, TagType } from "../utils";

export default {
  name: "FieldDialog",
  data() {
    return {
      visible: false,
      title: "",
      fields: [],
      field: {},
      tagStatus: {},
      dataTypes: [
        "SMALLINT",
        "INT",
        "LONG",
        "DOUBLE",
        "NUMERIC",
        "DATE",
        "TIME",
        "TIMESTAMP",
        "CHAR",
        "VARCHAR",
        "CLOB",
        "BLOB"
      ]
    };
  },
  computed: {
    ...mapGetters(["fieldTags"])
  },
  watch: {
    field(newValue) {
      if (!newValue.tags) this.$set(newValue, "tags", {});
      if (this.fieldTags) {
        this.fieldTags.forEach(tag => {
          this.tagStatus[tag.name] = this._.has(newValue.tags, tag.name);
        });
      }
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
      this.$nextTick(() => {
        this.$refs.fieldList.setCurrentRow(this.field);
      });
    },
    fieldChange(row) {
      this.field = row;
    },
    addField() {
      let field = newField();
      this.fields.push(field);
      this.field = field;
      this.$refs.fieldList.setCurrentRow(this.field);
    },
    delField() {
      if (this.fields.length == 1) return;
      let inx = this.fields.indexOf(this.field);
      if (inx >= 0) this.fields.splice(inx, 1);
      if (inx == this.fields.length) inx--;
      this.field = this.fields[inx];
      this.$refs.fieldList.setCurrentRow(this.field);
    },
    moveUp() {
      let inx = this.fields.indexOf(this.field);
      if (inx == 0) return;
      swapArray(this.fields, inx, inx - 1);
    },
    moveDown() {
      let inx = this.fields.indexOf(this.field);
      if (inx == this.fields.length - 1) return;
      swapArray(this.fields, inx, inx + 1);
    },
    setTagStatus(tag, enabled) {
      this.tagStatus = { [tag.name]: enabled, ...this.tagStatus };
      if (enabled) {
        switch (tag.type) {
          case TagType.FLAG:
            this.$set(this.field.tags, tag.name, true);
            break;
          default:
            this.$set(this.field.tags, tag.name, "");
        }
      } else this.field.tags = this._.omit(this.field.tags, [tag.name]);
    }
  }
};
</script>

<style lang="scss">
.field-dialog {
  margin-top: 20px !important;
  & .el-dialog__body {
    display: flex;
    position: absolute;
    width: 100%;
    top: 30px;
    bottom: 0px;
  }
  .field-dialog-list {
    display: flex;
    overflow: scroll;
    min-width: 150px;
    flex: 1;
    flex-direction: column;
    .field-actions {
      width: 100%;
      height: 30px;
      background: #1e1e1e;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .field-list {
      flex: 1;
    }
  }
  .field-form {
    flex: 4;
  }
  .extra-input > div {
    display: flex;
    align-items: center;
    .el-switch {
      margin-right: 5px;
    }
  }
}
</style>
