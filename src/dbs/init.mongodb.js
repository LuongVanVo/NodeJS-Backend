import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import checkConnect from "../helpers/check.connect.js"; 

// cách connect mới, khuyên dùng 

const connectString = process.env.CONNECTION_STRING;

class Database {
  constructor() {
    this.connect();
  }

  // connect
  connect(type = 'mongodb') {
    // dev 
    if (1 === 1) {
        mongoose.set('debug', true)
        mongoose.set('debug', { color: true })
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 50, // Giới hạn số lượng kết nối tối đa trong pool
      })
      .then((_) => {
        console.log(`Connected Mongodb Success PRO`, checkConnect.countConnect())
      })
      .catch((err) => console.log(`Error Connect !`));
  }

  static getInstance() {
    if (!Database.instance) {
        Database.instance = new Database()
    } 
    return Database.instance
  }
}

const instanceMongoDB = Database.getInstance()
export default instanceMongoDB