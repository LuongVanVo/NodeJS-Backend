"use strict";

import mongoose, { Schema } from "mongoose";

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "carts";

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ["active", "completed", "failed", "pending"],
      default: "active",
    },
    cart_products: { type: Array, required: true, default: [] },
    /* 
    [
        {
            productId:
            shopId:
            quantity:
            name:
            price:
        }
    ]
  */
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Number, required: true },
  },
  {
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
    collection: COLLECTION_NAME,
  }
);

//Export the model
export default mongoose.model(DOCUMENT_NAME, cartSchema);
