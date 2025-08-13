import { convertToObjectIdMongodb } from "../../ultis/index.js";
import inventoryModel from "../inventory.model.js";
import { Types } from "mongoose";

export const insertInventory = async ({ productId, shopId, stock, location = 'Unknown' }) => {
    return await inventoryModel.create({
        inven_productId: productId,
        inven_shopId: shopId,
        inven_stock: stock,
        inven_location: location
    })
}

// hàm này dùng để cập nhật lại stock của sản phẩm
export const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        inven_productId: convertToObjectIdMongodb(productId),
        inven_stock: {$gte: quantity}
    }, updateSet = {
        $inc: {
            inven_stock: -quantity
        }, 
        $push: {
            inven_resevation: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }, option = { upsert: true, new: true }

    return await inventoryModel.updateOne(query, updateSet);
}