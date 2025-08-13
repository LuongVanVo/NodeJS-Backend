"use strict";
import { convertToObjectIdMongodb } from "../../ultis/index.js";
import cartModel from "../cart.model.js";

/// START REPO CART///
export const createUserCart = async ({ userId, product }) => {
  const query = { cart_userId: userId, cart_state: "active" };
  const updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    },
    options = { upsert: true, new: true };

  return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
};

export const updateUserCartQuantity = async ({ userId, product }) => {
  const { productId, quantity } = product;
  
  // ✅ Kiểm tra sản phẩm có tồn tại trong giỏ hàng không
  const existingCart = await cartModel.findOne({
    cart_userId: userId,
    "cart_products.productId": productId,
    cart_state: "active",
  });

  if (existingCart) {
    // ✅ Sản phẩm đã tồn tại → Cập nhật quantity
    const query = {
      cart_userId: userId,
      "cart_products.productId": productId,
      cart_state: "active",
    };
    const updateSet = {
      $inc: {
        "cart_products.$.quantity": quantity,
      },
    };
    const options = { new: true };
    
    return await cartModel.findOneAndUpdate(query, updateSet, options);
  } else {
    // ✅ Sản phẩm chưa tồn tại → Thêm mới
    const query = { 
      cart_userId: userId, 
      cart_state: "active" 
    };
    const updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    };
    const options = { upsert: true, new: true };
    
    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }
};
export const findCartById = async (cartId) => {
  return await cartModel.findOne({ _id: convertToObjectIdMongodb(cartId), cart_state: 'active' }).lean();
}
/// END REPO CART ///
