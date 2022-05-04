
const express = require("express");
const socketIo = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: '*',
    }
  });

 
   
  io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('disconnect', () => {
	  console.log('user disconnected');
	});
  });
  

/*
io.on('conexão', (socket) => {

	console.log("Alguém conectado");

	socket.on('join', ({ teste }) => {

		console.log("Alguém se juntou na sala" + teste);

		socket.to(teste).emit('Join', 'Uma pessoa se juntou!');

	});
});

*/

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log('Servidor online na porta:', server.address().port);
});
