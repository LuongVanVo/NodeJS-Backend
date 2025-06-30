'use strict'

import mongoose, { Schema } from "mongoose";

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'
// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema({
    user:{
        type: Schema.Types.ObjectId,
        requied: true,
        ref: 'Shop'
    },
    publicKey:{
        type:String,
        required:true,
    },
    refreshTokensUsed:{
        type: Array,
        default: [] // những RefreshToken đã được sử dụng
    },
    refreshToken: {
        type: String, 
        required: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
export default mongoose.model(DOCUMENT_NAME, keyTokenSchema)