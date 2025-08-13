'use strict'

import { BadRequestError, NotFoundError } from "../core/error.response.js";
import orderModel from "../models/order.model.js";
import { findCartById } from "../models/repositories/cart.repo.js";
import { checkProductByServer } from "../models/repositories/product.repo.js";
import DiscountService from "./discount.service.js";
import { acquireLock, releaseLock } from "./redis.service.js";
class CheckoutService {
    // login and without login
    /* 
        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId:
                    shop_discount: [
                        {
                            shopId,
                            discountId,
                            codeId
                        }
                    ],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ]
                },
            ]
        }
    */
    static async checkoutReview({ cartId, userId, shop_order_ids }) {
        // check cartId co ton tai khong?
        const foundCart = await findCartById(cartId);
        if (!foundCart) 
            throw new BadRequestError(`Cart doesn't exist !!`);

        const checkout_order = {
            totalPrice: 0, // tong tien hang
            feeShip: 0, // phi van chuyen
            totalDiscount: 0, // tong tien discount giam gia
            totalCheckout: 0 // tong so tien phai thanh toan
        }, shop_order_ids_new = []

        // tinh tong tien bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i];
            // check product available
            const checkProductServer = await checkProductByServer(item_products);
            console.log(`checkProductServer::`, checkProductServer);
            if (!checkProductServer[0]) throw new BadRequestError(`order wrong !!!`);

            // tong tien don hang
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price);
            }, 0);
            
            // tong tien truoc khi xu ly
            checkout_order.totalPrice += checkoutPrice;

            const itemCheckout = {
                shopId, 
                shop_discounts,
                priceRaw: checkoutPrice, // tong gia tri truoc khi giam gia
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer,
            }

            // neu shop_discounts ton tai > 0, check xem co hop le hay khong
            if (shop_discounts.length > 0) {
                // gia su chi co 1 discount
                // get amount discount
                const { totalPrice = 0, discount = 0 } = await DiscountService.getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId, 
                    shopId,
                    products: checkProductServer
                })
                // tong cong discount giam gia
                checkout_order.totalDiscount += discount;

                // neu tien giam gia lon hon khong
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount;
                }
            }
            // tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
            shop_order_ids_new.push(itemCheckout);
        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order,
        }
    }

    // order 
    static async orderByUser({ shop_order_ids, cartId, userId, user_address = {}, user_payment = {} }) {
        const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
            cartId, 
            userId, 
            shop_order_ids
        });

        // check lại một lần nữa xem vượt tồn kho hay không
        // get new array Products
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        console.log(`[1]: `, products);
        const acquireProduct = [];
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i];
            const keyLock = await acquireLock(productId, quantity, cartId);
            acquireProduct.push(keyLock ? true : false);
            if (keyLock) {
                await releaseLock(keyLock);
            }
        }

        // check if co mot san pham het hang trong kho
        if (acquireProduct.includes(false)) {
            throw new BadRequestError(`Một số sản phẩm đã được cập nhật, vui lòng quay lại giỏ hàng !!!`);
        } 

        const newOrder = await orderModel.create({
            order_userId: userId,
            order_checkout_order: checkout_order,
            order_shiping: user_address,
            order_payment: user_payment,
            order_product: shop_order_ids_new
        });

        // Trường hợp: nếu insert thành công, thì remove product có trong cart
        if (newOrder) {
            // remove product in my cart 

        }

        return newOrder;
    }

    /* 
        1. query Orders [Users]
    */
    static async getOrdersByUser() {

    }

    /* 
        1. query Orders Using id [Users]
    */
    static async getOneOrderByUser() {

    }

    /* 
        1. Cancel Order [Users]
    */
    static async cancelOrderByUser() {

    }

    /* 
        1. Update Order Status [Shop | Admin] *
    */
    static async updateOrderStatusByShop() {

    }
}

export default CheckoutService