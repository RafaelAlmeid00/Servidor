const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const session = require('express-session');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const knex = require('./database/index')

app.use(cors({
    credentials: true,
}));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(session({
    key: "userId",
    secret: 'sazuki',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 1000 * 60 * 60 * 24,
    }
})); 

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST"]
    },
});

io.on('connection', async (socket) => {
  console.log('Um cliente se conectou ao Socket.io');
    socket.emit("message", "Funfa");

    socket.on("userDetails", async (data) => {
        const user = await knex("user").where("user_CPF", "=", data).first()
        console.log(user);
        socket.emit("userDetails", user);
    })
});



app.use(express.json());
app.use(routes);

server.listen(process.env.PORT || 3344, () => {
    console.log("Server is running on port 3344");
});
