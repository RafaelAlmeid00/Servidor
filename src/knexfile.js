const dotenv = require('dotenv');
dotenv.config()

module.exports = {
    development : {
        client : 'mysql2',
        connection: {
            host: process.env.HOST,
            port: process.env.PORTDB,
            user: process.env.USERDB,
            password: process.env.SENHA,
            database: process.env.DB,
        }
    }
}