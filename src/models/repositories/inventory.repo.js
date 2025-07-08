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