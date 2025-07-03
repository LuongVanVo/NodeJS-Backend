import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import "./dbs/init.mongodb.js";
import checkConnect from "./helpers/check.connect.js";
import router from "./routes/index.js";

const app = express();

// INIT MIDDLEWARES

// morgan dùng để log request
app.use(morgan("dev"));

// helmet dùng để bảo mật ứng dụng express
// nó sẽ thiết lập các tiêu đề HTTP bảo mật
// để giúp bảo vệ ứng dụng khỏi các lỗ hổng bảo mật phổ biến
app.use(helmet());
// compression dùng để nén các phản hồi HTTP
// giúp giảm kích thước dữ liệu được truyền qua mạng
// từ đó cải thiện hiệu suất và tốc độ tải trang
// nén các phản hồi HTTP
// giúp giảm băng thông và thời gian tải trang
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// init db
checkConnect.checkOverload();
// init routes
app.use(router);

// handle error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).send({
    status: "error",
    code: statusCode,
    // stack: error.stack, // only for development, dùng để debug
    message: error.message || "Internal Server Error",
  });
});

export default app;
