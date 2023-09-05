
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
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"]
  },
   allowRequest: (req, callback) => {
    const noOriginHeader = req.headers.origin === undefined;
    callback(null, noOriginHeader);
  }
});

app.use(cors({
    credentials: true
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
    cookie:{
    expires: 1000*60*60*24,
    }
})); 

io.on('connection', (socket) => {
    console.log('Um cliente se conectou ao Socket.io');
    // Aqui você pode adicionar lógica para manipular eventos do Socket.io
});

app.use(express.json());
app.use(routes);

server.listen(process.env.port, () => {
    console.log("Server on in door 3344");
});

