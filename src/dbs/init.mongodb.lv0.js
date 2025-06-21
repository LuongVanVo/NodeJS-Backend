import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// cách connect cũ 
const connectString = process.env.CONNECTION_STRING;

mongoose
  .connect(connectString)
  .then((_) => console.log(`Connected Mongodb Success`))
  .catch((err) => console.log(`Error Connect !`));

// dev
if (1 === 1) {
    mongoose.set('debug', true)
    mongoose.set('debug', { color: true })
}

export default mongoose