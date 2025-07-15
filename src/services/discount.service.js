"use strict";

import { BadRequestError, NotFoundError } from "../core/error.response.js";
import discountModel from "../models/discount.model.js";
import productModel from "../models/product.model.js";
import { checkDiscountExists, findAllDiscountCodeUnSelect, foundDiscountExist } from "../models/repositories/discount.repo.js";
import { findAllProducts } from "../models/repositories/product.repo.js";
import { convertToObjectIdMongodb } from "../ultis/index.js";

/* 
    Discount Service
    1 - Generator Discount Code [Shop | Admin]
    2 - Get discount amount [User]
    3 - Get all discount codes [User | Shop]
    4 - Verify discount code [User]
    5 - Delete discount code [Shop | Admin]
    6 - Cancel discount code [User]
*/

class DiscountService {
  static async createDiscountCode(payload) {
    const {
        code, start_date, end_date, is_active, 
        shopId, min_order_value, product_ids, applies_to, name, description,
        type, value, max_value, max_uses, uses_count, max_uses_per_user, user_used
    } = payload;
    // kiem tra
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) 
        throw new BadRequestError("Discount code has expired !");

    if (new Date(start_date) >= new Date(end_date)) 
        throw new BadRequestError('Start date must be before end date !');

    // create index for discount code
    // ta khai báo trong model schema discount_shopId là ObjectId, nên truyền vào cần chuyển sang ObjectId 
    const foundDiscount = await foundDiscountExist({
        discountCode: code, 
        shopId: shopId
    });
    if (foundDiscount && foundDiscount.discount_is_active === true) {
        throw new BadRequestError("Discount exists !!");
    }

    const newDiscount = await discountModel.create({
        discount_name: name,
        discount_description: description,
        discount_type: type,
        discount_value: value,
        discount_code: code,
        discount_start_date: start_date,
        discount_end_date: end_date,
        discount_max_uses: max_uses,
        discount_uses_count: uses_count,
        discount_user_used: user_used,
        discount_max_uses_per_users: max_uses_per_user,
        discount_min_order_value: min_order_value,
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: is_active,
        discount_applies_to: applies_to,
        discount_product_ids: applies_to === 'all' ? [] : product_ids
    })
    return newDiscount;
  }

  static async updateDiscountCode({ payload, codeFound, shopId }) {
    // update discount code   
    const {
        name, description, type, value, code, start_date, end_date,
        max_uses, uses_count, user_used, max_uses_per_user, min_order_value,
        is_active, applies_to, product_ids
    } = payload;

    const foundDiscount = await checkDiscountExists({
        model: discountModel,
        filter: {
            discount_code: codeFound,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }
    })
    
    if (!foundDiscount) throw new NotFoundError(`Discount doesn't exist !!`);

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) 
        throw new BadRequestError("Discount code has expired !");
    if (new Date(start_date) >= new Date(end_date))
        throw new BadRequestError('Start date must be before end date !');

    // update discount code
    const updatedDiscount = await discountModel.findByIdAndUpdate(
        foundDiscount._id,
        {
            $set: {
                discount_name: name,
                discount_description: description,
                discount_type: type,
                discount_value: value,
                discount_code: code,
                discount_start_date: start_date,
                discount_end_date: end_date,
                discount_max_uses: max_uses,
                discount_uses_count: uses_count,
                discount_user_used: user_used,
                discount_max_uses_per_users: max_uses_per_user,
                discount_min_order_value: min_order_value,
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: is_active,
                discount_applies_to: applies_to,
                discount_product_ids: applies_to === 'all' ? [] : product_ids
            }
        },
    {
        new: true,
    })
    if (!updatedDiscount) 
        throw new NotFoundError(`Failed to update discount code ${codeFound}`);
    return updatedDiscount;
  }

  // Get all discount code available with product (lấy sản phẩm của discount code)

  /*                
                  -> product_1
    discount_code -> product_2
                  -> product_3

  */
  static async getAllDiscountCodeWithProduct({ code, shopId, userId, limit, page }) {
    // create index for discount_code
    const foundDiscount = await foundDiscountExist({
        discountCode: code,
        shopId: shopId
    });
    console.log('foundDiscount', foundDiscount);
    if (!foundDiscount || foundDiscount.discount_is_active === false) 
        throw new NotFoundError('Not found discount !');

    let product;

    // get all product
    if (foundDiscount.discount_applies_to === 'all') {
        product = await findAllProducts({
            filter: {
                product_shop: convertToObjectIdMongodb(shopId),
                isPublished: true
            },
            limit: +limit,
            page: +page,
            sort: 'ctime',
            select: ['product_name']
        });
    }       
    
    // get the products ids 
    if (foundDiscount.discount_applies_to === 'specific') {
        product = await findAllProducts({
            filter: {
                _id: {$in: foundDiscount.discount_product_ids },
                isPublished: true
            },
            limit: +limit,
            page: +page,
            sort: 'ctime',
            select: ['product_name']
        });
    }

    return product;
  }

  // get all discount code by shop (lấy tất cả discount code của shop)
  /* 
           -> discount_1
    shopId -> discount_2
           -> discount_3
  */
  static async getAllDiscountCodeByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodeUnSelect({
        limit: +limit,
        page: +page,
        sort: 'ctime',
        filter: {
            discount_shopId: convertToObjectIdMongodb(shopId),
            discount_is_active: true
        },
        unSelect: ['__v', 'discount_shopId'],
        model: discountModel
    });

    return discounts;
  }

  /* 
    Apply discount code
    products = [
        {
            productId,
            shopId,
            quantity,
            name, 
            price
        },
        {
            productId,
            shopId,
            quantity,
            name, 
            price
        }
    ]
  */

    static async getDiscountAmount({ codeId, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExists({
            model: discountModel,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId),
            }
        })

        if (!foundDiscount) throw new NotFoundError(`Discount doesn't exists`);

        const {
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_max_uses_per_users,
            discount_user_used,
            discount_start_date,
            discount_end_date,
            discount_type,
            discount_value
        } = foundDiscount;

        if (!discount_is_active) throw new NotFoundError(`discount expired!`);
        if (discount_max_uses <= 0) throw new NotFoundError(`discount are out!`);

        if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) 
            throw new NotFoundError(`Discount code has expired !!`);

        // check xem co add gia tri toi thieu hay khong
        let totalOrder = 0;
        if (discount_min_order_value > 0) {
            // get total
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0);

            if (totalOrder < discount_min_order_value)
                throw new NotFoundError(`Discount requires a minimum order value of ${discount_min_order_value}`);
        }
        if (discount_max_uses_per_users > 0) {
            const userUserDiscount = discount_user_used.find(user => user.userId === userId);
            if (userUserDiscount) {
                throw new NotFoundError(`You have used this discount code ${userUserDiscount.uses} times, maximum allowed is ${discount_max_uses_per_users}`);
            }
        }
        // check xem discount nay la fixed_amount
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100);

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    // ở đây là xóa văng ra khỏi db (là mất vĩnh viễn), nhưng thông thường thì muốn xóa thì chuyển nó sang 1 database mới để lưu vết
    static async deleteDiscountCode({ shopId, codeId }) {
        const deleted = await discountModel.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId)
        });
        if (!deleted) 
            throw new NotFoundError(`Discount code ${codeId} not found for shop ${shopId}`);
        return deleted;
    }

    // Cancel discount code , user hủy khong dùng discount code nữa  
    static async cancelDiscoutCode({ codeId, shopId, userId }) {
        const foundDiscount = await checkDiscountExists({
            model: discountModel,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId),
            }
        })
        if (!foundDiscount) 
            throw new NotFoundError(`Discount not found !!`);

        const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_user_used: userId,
            }, 
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })

        return result;
    }
}

export default DiscountService;
