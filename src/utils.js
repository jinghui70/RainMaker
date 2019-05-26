import _uuid from "uuid/v1";

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

export const TagType = Object.freeze({
  FLAG: "FLAG",
  STRING: "STRING",
  LIST: "LIST",
  TABLE: "TABLE",
  FIELD: "FIELD"
});

export function createTable() {
  return {
    id: uuid(),
    type: ElementType.TABLE,
    name: "",
    code: "",
    label: "",
    comment: "",
    linkFields: [],
    indexes: [],
    fields: [createField()],
    tags: {}
  };
}

export function createField() {
  return {
    id: uuid(),
    name: "new",
    code: "NEW",
    label: "新属性",
    type: "VARCHAR",
    length: 0,
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
    targetTable: null,
    targetFields: []
  };
}

export function swapArray(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
}
