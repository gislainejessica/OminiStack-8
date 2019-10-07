const  express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const cors = require('cors');
const httpServer = express();

// Expert
const server = require('http').Server(httpServer); // Une
const io = require('socket.io')(server); // Inicializa
const connectedUsers = {}

// Expert (Socket)
io.on('connection', socket => {
    //console.log('Nova', socket.id)
    const {user} = socket.handshake.query;
    connectedUsers[user] = socket.id;
    // console.log(user, socket.id)
    socket.on('deuMatch', dev =>{
        console.log('deuMatch')
    });
    // Escutando mensagem do frontendOmini
    // socket.on('hello', message =>{ console.log(message)});
    // Enviando menssagem para o frontendOmini
    // setTimeout(()=> { socket.emit('world', {  message: 'Oministack'  })});
});

mongoose.connect("mongodb+srv://cha_comigo:cha_comigo@cluster0-udt7r.mongodb.net/oministack8?retryWrites=true&w=majority",{
    useNewUrlParser:true,  useUnifiedTopology: true 
});

// Expert (Midlleware de conexão com LikeController)
httpServer.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;
    return next();
});

httpServer.use(cors());
httpServer.use(express.json());
httpServer.use(routes);

// Expert
server.listen(7777);    