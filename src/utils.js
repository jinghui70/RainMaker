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

export const TagType = Object.freeze({
  FLAG: "FLAG",
  STRING: "STRING",
  LIST: "LIST",
  TABLE: "TABLE",
  FIELD: "FIELD"
});

const newTableTag = function(model) {
  if (_.isEmpty(model.tableTags)) return null;
  let result = {};
  model.tableTags.forEach(tag => {
    if (tag.type == TagType.FLAG) result[tag.name] = false;
    else result[tag.name] = null;
  });
  return result;
};

export function newTable(model) {
  return {
    id: uuid(),
    type: ElementType.TABLE,
    name: "",
    code: "",
    label: "",
    comment: "",
    linkFields: [],
    indexes: [],
    fields: [newField()],
    tags: newTableTag(model)
  };
}

export function newField() {
  return {
    id: uuid(),
    name: "new",
    code: "NEW",
    label: "新属性",
    type: "VARCHAR",
    length: 22,
    precision: 0,
    comment: "",
    tags: {}
  };
}

export function newLink(fields) {
  let name = fields.length == 1 ? fields[0].name : "";
  let label = fields.length == 1 ? fields[0].label : "";
  return {
    name,
    label,
    fields: [...fields],
    many: false,
    interTable: null,
    leftFields: [],
    rightFields: [],
    targetTable: null,
    targetFields: []
  };
}

export function swapArray(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
}
