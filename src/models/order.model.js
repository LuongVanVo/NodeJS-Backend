"use strict";

import mongoose, { Schema } from "mongoose";

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "orders";

const orderSchema = new Schema({
    order_userId: { type: Number, required: true },
    order_checkout_order: { type: Object, default: {} },
    /*
        order_checkout = {
            totalPrice,
            totalApplyDiscount,
            feeShip
        }
    */
   order_shiping: { type: Object, default: {} },
   /*
        street,
        city,
        state,
        country
   */
  order_payment: { type: Object, default: {} },
  order_product: { type: Array, required: true },
  order_trackingNumber: { type: String, default: '#0000118052022' },
  order_status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending'},
}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    }
});

//Export the model
export default mongoose.model(DOCUMENT_NAME, orderSchema);
