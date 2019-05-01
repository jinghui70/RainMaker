import { uuid, ElementType } from "./utils.js";
import _ from "lodash";

export class ModelObject {
  constructor() {
    this.root = {
      label: "未命名",
      type: ElementType.MODEL,
      children: []
    };
    this.model = {
      label: "未命名",
      name: "Unkown",
      tableTags: [],
      fieldTags: []
    };
    this.tables = {}; // 花名册
  }

  loadFromFile(file) {
    this.root = this.loadUnit(file, null);
    this.root.label = file.label;
    this.root.type = ElementType.MODEL;
    this.model = _.pick(file, ["label", "name", "comment", "tableTags", "fieldTags"]);
    this.loadLink();
  }

  loadUnit(unit, parent) {
    let result = { id: uuid(), type: ElementType.UNIT, label: unit.label, parent };
    result.children = [];
    if (_.isArray(unit.tables)) {
      // 处理每个表，加ID
      unit.tables.forEach(table => {
        table.id = uuid();
        this.tables[table.id] = table;
        table.unit = result;
        table.type = ElementType.TABLE;
        if (table.tags == null) table.tags = {};
        // 字段加ID
        if (_.isArray(table.fields))
          table.fields.forEach(f => {
            f.id = uuid();
            if (!f.tags) f.tags = {};
          });
        if (_.isArray(table.indexes)) {
          table.indexes.forEach(i => {
            if (_.isArray(i.fields)) i.fields = i.fields.map(f => this.fieldName2Id(table, f));
          });
        }
        result.children.push(table);
      });
    }
    if (_.isArray(unit.units)) {
      unit.units.forEach(unit => {
        result.children.push(this.loadUnit(unit, result));
      });
    }
    return result;
  }

  loadLink() {
    _.values(this.tables).forEach(table => {
      if (_.isArray(table.linkFields)) {
        table.linkFields.forEach(linkField => {
          linkField.fields = linkField.fields.map(f => this.fieldName2Id(table, f));

          if (linkField.interTable) {
            try {
              const interTable = this.tableName2Table(linkField.interTable);
              linkField.interTable = interTable.id;
              linkField.leftFields = linkField.leftFields.map(f => this.fieldName2Id(interTable, f));
              linkField.rightFields = linkField.rightFields.map(f => this.fieldName2Id(interTable, f));
            } catch (e) {
              throw new Error(`读取表${table.name}link属性${linkField.name}中间表${linkField.interTable}出错:${e}`);
            }
          }
          try {
            const targetTable = this.tableName2Table(linkField.targetTable);
            linkField.targetTable = targetTable.id;
            linkField.targetFields = linkField.targetFields.map(f => this.fieldName2Id(targetTable, f));
          } catch (e) {
            throw new Error(`读取表${table.name}link属性${linkField.name}目标表${linkField.targetTable}出错:${e}`);
          }
        });
      }
    });
  }

  tableName2Table(tableName) {
    const table = _.values(this.tables).find(t => t.name == tableName);
    if (!table) throw new Error(`表${tableName}没找到`);
    return table;
  }
  tableName2Id(tableName) {
    return this.tableName2Table(tableName).id;
  }

  fieldName2Field(table, fieldName) {
    const field = table.fields.find(f => f.name == fieldName);
    if (!field) throw new Error(`${table.label}-${table.name}的字段${fieldName}没找到`);
    return field;
  }

  fieldName2Id(table, fieldName) {
    return this.fieldName2Field(table, fieldName).id;
  }

  fieldId2Field(table, id) {
    return table.fields.find(f => f.id == id);
  }

  fieldId2FieldName(table, id) {
    let field = this.fieldId2Field(table, id);
    return field ? field.name : "";
  }

  toFileObject() {
    const root = this.saveUnit(this.root);
    let result = { ...this.model, tables: root.tables, units: root.units };
    return result;
  }

  saveUnit(unit) {
    let tables = [];
    let units = [];
    unit.children.forEach(child => {
      if (child.type == ElementType.TABLE) {
        tables.push(this.saveTable(child));
      } else {
        units.push(this.saveUnit(child));
      }
    });
    let result = { label: unit.label };
    if (tables.length > 0) result.tables = tables;
    if (units.length > 0) result.units = tables;
    return result;
  }

  saveTable(table) {
    let result = _.pick(table, ["code", "label", "name", "comment"]);
    if (!_.isEmpty(table.tags)) result.tags = _.cloneDeep(table.tags);
    if (!_.isEmpty(table.fields)) {
      result.fields = table.fields.map(f => this.saveField(f));
    }
    if (!_.isEmpty(table.indexes)) {
      result.indexes = table.indexes.map(i => this.saveIndex(table, i));
    }
    if (!_.isEmpty(table.linkFields)) {
      result.linkFields = table.linkFields.map(link => this.saveLinkField(table, link));
    }
    return result;
  }

  saveField(field) {
    let result = _.omit(field, ["id", "tags"]);
    if (!_.isEmpty(field.tags)) result.tags = _.cloneDeep(field.tags);
    return result;
  }

  saveIndex(table, index) {
    let result = _.omit(index, ["fields"]);
    if (!_.isEmpty(index.fields)) result.fields = index.fields.map(id => this.fieldId2FieldName(table, id));
    return result;
  }

  saveLinkField(table, link) {
    let result = { name: link.name, label: link.label };
    if (!_.isEmpty(link.fields)) result.fields = link.fields.map(id => this.fieldId2FieldName(table, id));
    if (link.interTable) {
      let interTable = this.tables[link.interTable];
      result.interTable = interTable ? interTable.name : "";
      if (interTable) {
        result.leftFields = link.leftFields.map(id => this.fieldId2FieldName(interTable, id));
        result.rightFields = link.rightFields.map(id => this.fieldId2FieldName(interTable, id));
      }
    }
    let targetTable = this.tables[link.targetTable];
    result.targetTable = targetTable ? targetTable.name : "";
    if (targetTable) result.targetFields = link.targetFields.map(id => this.fieldId2FieldName(targetTable, id));
    return result;
  }

  check() {
    // 检查link型的tag指向的表与字段还存在吗
    // 检查link型tag字段与link字段是否重复
    // 检查link字段是否重复
    // 检查表名、数据库名是否重复
    // 检查表是否有错误的字段
    // 检查表FLAG标签字段完整性
    // 检查INDEX名唯一性
  }
}
