"use strict";

import mongoose, { Schema } from "mongoose";

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

// Declare the Schema of the Mongo model
var inventorySchema = new mongoose.Schema({
    inven_productId: { type: Schema.Types.ObjectId, ref: "Product" },
    inven_location: { type: String, default: 'Unknown' },
    inven_stock: { type: Number, required: true },
    inven_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    inven_reservations: { type: Array, default: [] }, 
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

//Export the model
export default mongoose.model(DOCUMENT_NAME, inventorySchema);
