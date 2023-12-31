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
const middleware = require('./controllers/Middleware');
const uniqid = require('uniqid');
app.use(cors({
  credentials: true,
}));
app.use(function (req, res, next) {
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
app.use(express.json());
app.use(routes);
const servidor = server.listen(3344, () => {
  console.log("Server is running on port 3344");
});
//Controller
const controllersSocket = require('./controllers/socket/index');
//Socket.io

const io = new Server(servidor, {
  cors: {
    origin: [
      "https://easypass-app.onrender.com",
      "http://localhost:5173",
      "http://localhost:19006",
      "http://localhost:5174",
      "https://192.168.5.108:19006",
      "http://192.168.5.108:19000",
      "http://192.168.5.108:8081",
      "https://localhost:19006"
    ],
    credentials: true,
    methods: ["GET", "POST"]
  },
}); 

//A pica ta no origin, eu precisaria de 2 origins 1 do user e outro do adm
 


io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Token não fornecido"));
  }
  const headers = {
    authorization: token
  };
  middleware.mid({ headers }, {}, (error) => {
    if (error) {
      return next(new Error("Token inválido"));
    }
    next();
  });
}); 
  io.on('connection', async (socket) => {
    console.log('Um cliente se conectou ao Socket.io');
    
    const token = socket.handshake.auth.token;
    socket.on("userDetails", async (data) => {
      controllersSocket.searchUserCPF(socket, data)
    })
    
    socket.on("cardDetails", async (data) => {
     
      controllersSocket.searchCardAtivo(socket, data)
    })

     
    socket.on("getMSG", async (data) => {
     
      controllersSocket.getMSG(socket, data)
    })
    
    socket.on("userMensage", async (mensage, data, query, user, Ticket) => {
      
      if (user == 'client') {
        console.log('olá, client', mensage, data, query);
        controllersSocket.messageToadm(socket, mensage, data, query, io);
      }else{
        console.log('olá, adm', mensage, data);
        controllersSocket.messageTouser(mensage, data, io, Ticket);
      }
    })
    //só falta fzr um emit aq pro client e o adm
    socket.on("connect", (data) => {
      console.log('olá, funfou');
    });
    socket.on("ping", (callback) => {
      callback();
    });
  });

//app.listen('3344')
