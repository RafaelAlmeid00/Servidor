const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    development : {
        client : 'mysql2',
        connection: {
            host: process.env.host,
            port: process.env.portdb,
            user: process.env.user,
            password: process.env.senha,
            database: process.env.db,
        }
    }
}