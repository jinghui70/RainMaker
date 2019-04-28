import _uuid from "uuid/v1";
import _ from "lodash";

export function uuid() {
  return _uuid().substr(0, 8);
}

export function filterNode(value, data) {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
}

export const ElementType = Object.freeze({
  MODEL: 0,
  UNIT: 1,
  TABLE: 2,
  FIELD: 3,
  INDEX: 4
});

export const DataType = [
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
];

export const getField = function(table, fieldName) {
  const field = table.fields.find(field => field.name == fieldName);
  if (field == null) throw new Error(`表${table.name}的字段${fieldName}不存在`);
  return field;
};

export class ModelReader {
  constructor(file) {
    this.tableCodeSet = new Set();
    this.tables = {};
    const root = this.loadUnit(file.root);
    root.label = file.label;
    root.code = file.code;
    root.type = ElementType.MODEL;
    this.tree = [root];
    var me = this;
    _.values(this.tables).forEach(table => {
      if (table.linkFields) {
        table.linkFields.forEach(linkField => {
          linkField.fields = linkField.fields.map(f => getField(table, f));
          if (linkField.interTable) {
            const interTable = me.tables[linkField.interTable];
            if (interTable == null)
              throw new Error(`表${table.name}link属性${linkField.name}中间表${linkField.interTable}不存在`);
            linkField.interTable = interTable;
            linkField.leftFields = linkField.leftFields.map(f => getField(interTable, f));
            linkField.rightFields = linkField.rightFields.map(f => getField(interTable, f));
          }
          const targetTable = me.tables[linkField.targetTable];
          if (targetTable == null)
            throw new Error(`表${table.name}link属性${linkField.name}目标表${linkField.targetTable}不存在`);
          linkField.targetTable = targetTable;
          // eslint-disable-next-line no-console
          if (table.name == "Org") console.log(linkField.targetFields);
          linkField.targetFields = linkField.targetFields.map(f => getField(targetTable, f));
          // eslint-disable-next-line no-console
          if (table.name == "Org") console.log(linkField.targetFields);
        });
      }
      if (table.indexes) {
        table.indexes.forEach(index => {
          if (!index.fields) throw new Error(`表${table.name}的索引${index.code}未定义字段`);
          index.fields = index.fields.map(f => getField(table, f));
        });
      }
    });
  }

  loadUnit(unit) {
    let result = { label: unit.label, type: ElementType.UNIT };
    result.children = [];
    if (_.isArray(unit.tables)) {
      unit.tables.forEach(table => {
        if (_.has(this.tables, table.name)) {
          throw new Error("重复的表名字" + table.name);
        }
        if (this.tableCodeSet.has(table.code)) {
          throw new Error(`表${table.name}的代码${table.code}已存在`);
        }
        this.tables[table.name] = table;
        this.tableCodeSet.add(table.code);
        table.unit = unit;
        table.type = ElementType.TABLE;
        result.children.push(table);
      });
    }
    if (_.isArray(unit.units)) {
      unit.units.forEach(unit => {
        result.children.push(this.loadUnit(unit));
      });
    }
    return result;
  }
}
