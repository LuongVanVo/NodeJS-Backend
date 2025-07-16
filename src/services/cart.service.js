"use strict";

import cartModel from "../models/cart.model.js";
import { BadRequestError, NotFoundError } from "../core/error.response.js";
import {
  createUserCart,
  updateUserCartQuantity,
} from "../models/repositories/cart.repo.js";
import { getProductById } from "../models/repositories/product.repo.js";

/* 
    Key features: Cart Service
    - add product to cart [User]
    - reduce product quantity by one [User]
    - increase product quantity by one [User]
    - get cart [User]
    - delete cart [User]
    - delete cart item [User]
*/

class CartService {
  static async addToCart({ userId, product = {} }) {
    // check cart ton tai hay khong ?
    const userCart = await cartModel.findOne({ cart_userId: userId });
    if (!userCart) {
      // create new cart for User
      return await createUserCart({ userId, product });
    }

    // nếu có giỏ hàng rồi nhưng chưa có sản phẩm ?
    if (userCart.cart_products.length === 0) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // nếu giỏ hàng tồn tại và có sản phẩm này thì update quantity lên
    return await updateUserCartQuantity({ userId, product });
  }

  // update cart
  /* 
        shop_order_ids: [
            {
                shopId,
                item_products: [
                    {
                        quantity,
                        price,
                        shopId,
                        old_quantity,
                        productId
                    }
                ],
                version
            }
        ]
    */
  static async addToCartV2({ userId, shop_order_ids = {} }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];
    // check product co ton tai khong ?
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError(`Product not exist !!`);

    // compare
    if (foundProduct.product_shop.toString() != shop_order_ids[0]?.shopId)
      throw new NotFoundError(`Product do not belong to the shop`);

    if (quantity === 0) {
      // deleted product onto cart
    }

    return await updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    const query = {
        cart_userId: userId,
        cart_state: "active",
      },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      };
    const deleteCart = await cartModel.updateOne(query, updateSet);
    return deleteCart;
  }

  static async getListUserCart({ userId }) {
    return await cartModel
      .findOne({
        cart_userId: +userId,
      })
      .lean();
  }
}

export default CartService;
