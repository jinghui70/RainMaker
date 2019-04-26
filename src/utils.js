import _uuid from "uuid/v1";
import _ from "lodash";

export function uuid() {
  return _uuid().substr(0, 8);
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

export class ModelReader {
  constructor(file) {
    this.codeSet = new Set();
    this.tables = {};
    const root = this.loadUnit(file.root);
    root.label = file.label;
    root.code = file.code;
    root.type = ElementType.MODEL;
    this.tree = [root];
  }

  loadUnit(unit) {
    let result = { label: unit.label, type: ElementType.UNIT };
    result.children = [];
    if (_.isArray(unit.tables)) {
      unit.tables.forEach(table => {
        if (_.has(this.tables, table.name)) {
          throw new Error("重复的表名字" + table.name);
        }
        if (this.codeSet.has(table.code)) {
          throw new Error(`表${table.name}的代码${table.code}已存在`);
        }
        this.tables[table.name] = table;
        this.codeSet.add(table.code);
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
