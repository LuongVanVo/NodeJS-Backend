import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import './dbs/init.mongodb.js'
import checkConnect from "./helpers/check.connect.js"; 

const app = express()

// INIT MIDDLEWARES

// morgan dùng để log request
app.use(morgan("dev"))

// helmet dùng để bảo mật ứng dụng express
// nó sẽ thiết lập các tiêu đề HTTP bảo mật
// để giúp bảo vệ ứng dụng khỏi các lỗ hổng bảo mật phổ biến
app.use(helmet())
// compression dùng để nén các phản hồi HTTP
// giúp giảm kích thước dữ liệu được truyền qua mạng
// từ đó cải thiện hiệu suất và tốc độ tải trang
// nén các phản hồi HTTP
// giúp giảm băng thông và thời gian tải trang
app.use(compression())

// init db
checkConnect.checkOverload();
// init routes
app.get('/', (req, res) => {
    const strCompress = 'Hello VoLuong'
    return res.status(200).send({ 
        message: "Welcome Everyone ",
        metadata: strCompress.repeat(10000)
     })
})

// handle error

export default app