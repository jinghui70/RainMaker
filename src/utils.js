import _uuid from "uuid/v1";
import _ from "lodash";

export function uuid() {
  return _uuid().substr(0, 8);
}

export function filterNode(value, data) {
  if (!value) return true;
  return data.label.indexOf(value) !== -1 || (data.name && data.name.indexOf(value) != -1);
}

export const ElementType = Object.freeze({
  MODEL: 0,
  UNIT: 1,
  TABLE: 2
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
