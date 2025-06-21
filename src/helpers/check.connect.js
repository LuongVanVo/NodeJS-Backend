import mongoose from "mongoose";
import os from "os";
import process from "process";

const _SECONDS = 5000;
// count connection
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connection: ${numConnection}`);
};

// check overload
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length; // dùng lấy số lượng lõi CPU
    const memoryUsage = process.memoryUsage().rss; // sử dụng để lấy bộ nhớ đang sử dụng
    // Example maximum number of connections based on number of cores
    const maxConnections = numCores * 5; // Giả sử mỗi lõi CPU có thể xử lý 5 kết nối đồng thời

    console.log(`Active connections: ${numConnection}`);
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConnections) {
      console.log(`Connection overload detected!`);
    }
  }, _SECONDS); // Monitor every 5 seconds
};
export default {
  countConnect,
  checkOverload,
};
