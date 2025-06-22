import dotenv from 'dotenv'
dotenv.config()
// level 0
// const config = {
//     app: {
//         port: 3055
//     },
//     db: {
//         host: 'localhost',
//         port: 27017,
//         name: 'db'
//     }
// }

// level 1
const dev = {
    app: {
        port: process.env.DEV_APP_PORT
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'dbDev'
    }
}

const pro = {
    app: {
        port: process.env.PRO_APP_PORT || 3055,
    },
    db: {
        host: process.env.PRO_DB_HOST || 'localhost',
        port: process.env.PRO_DB_PORT || 27017,
        name: process.env.PRO_DB_NAME || 'dbProduct',
    }
}
const config = { dev, pro }
const env = process.env.NODE_ENV || 'dev'
console.log(config[env], env)
export default config[env]