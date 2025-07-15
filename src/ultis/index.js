"use strict";
import _ from "lodash";
import { Types } from "mongoose";

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

export const removeUndefinedObject = obj => {
  Object.keys(obj).forEach(k => {
    if (obj[k] == null) {
      delete obj[k];
    }
  })
  return obj;
}

export const updateNestedObjectParser = obj => {
  console.log(`[1]::`, obj);
  const final = {};
  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach(a => {
        final[`${k}.${a}`] = response[a];
      })
    } else {
      final[k] = obj[k];
    }
  })
  console.log(`[2]::`, final);
  return final;
}

// Chuyển đổi String thành ObjectId 
export const convertToObjectIdMongodb = id => {
  return new Types.ObjectId(id)
}