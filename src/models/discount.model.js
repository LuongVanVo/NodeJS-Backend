"use strict";

import mongoose, { Schema } from "mongoose";

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

// Declare the Schema of the Mongo model
var discountSchema = new mongoose.Schema({
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: 'fixed_amount' }, // mặc định giảm giá theo số tiền, or percentage (theo phan tram)
    discount_value: { type: Number, required: true }, // 10.000, 10%
    discount_code: { type: String, required: true }, // ma giam gia
    discount_start_date: { type: Date, required: true }, // ngay bat dau
    discount_end_date: { type: Date, required: true }, // ngay ket thuc
    discount_max_uses: { type: Number, required: true }, // so luong discount duoc ap dung
    discount_uses_count: { type: Number, required: true }, // so discount da su dung
    discount_user_used: { type: Array, default: [] }, // user nao da su dung discount
    discount_max_uses_per_users: { type: Number, required: true }, // so luong cho phep toi da duoc su dung moi user
    discount_min_order_value: { type: Number, required: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: { type: String, require: true, enum: ['all', 'specific']}, // những sản phẩm nào có thể áp mã giảm giá 
    discount_product_ids: { type: Array, default: []}, // so san pham duoc ap dung
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

//Export the model
export default mongoose.model(DOCUMENT_NAME, discountSchema);
