"use strict";

import { convertToObjectIdMongodb, getSelectData, ungetSelectData } from "../../ultis/index.js";
import discountModel from "../discount.model.js";

export const foundDiscountExist = async ({ discountCode, shopId} ) => {
  return await discountModel
    .findOne({
      discount_code: discountCode,
      discount_shopId: convertToObjectIdMongodb(shopId),
    })
    .lean();
};

// get all discount code of shop 
export const findAllDiscountCodeUnSelect = async ({ limit = 50, page = 1, sort = 'ctime', filter, unSelect, model }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const discounts = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(ungetSelectData(unSelect))
        .lean();
    
    return discounts;
}

export const findAllDiscountCodeSelect = async (limit = 50, page = 1, sort = 'ctime', filter, Select, model) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const discounts = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(Select))
        .lean();
    
    return discounts;
}

export const checkDiscountExists = async ({ model, filter }) => {
    return await model.findOne(filter).lean();
}