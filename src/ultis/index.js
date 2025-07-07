"use strict";
import _ from "lodash";

export const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};

// Chuyển một mảng thành 1 object 
// ['a', 'b'] = {a: 1, b: 1}
export const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 1]));
}

// ['a', 'b'] = {a: 0, b: 0}
export const ungetSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 0]));
}