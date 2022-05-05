const SerialPort = require('serialport');
const port = new SerialPort( 'COM3',{
	baudRate: 9600,
  });


const Readline = SerialPort.parsers.Readline;
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

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
var pesoAux = 0;
 
server.listen(3000, () => {
    console.log('Servidor online na porta:', server.address().port);
});

port.on('open', function () {
    port.on('data', function (res) {

		//console.log(res.toString('utf8').substring(0, 1) === 'L')

		//res.toString('utf8').substring(2, 8).length > 5 ? console.log(res.toString('utf8').substring(3, 9)) : 0

		//console.log(res.toString('utf8').substring(2, 8).length)

		//05/05
		// var peso = res.toString('utf8').substring(2, 8).replace(/(\d{1})?(\d{8})/, "$1.$2");
        var peso = res.toString('utf8').substring(0, 8).replace(/(\d{1})?(\d{8})/, "$1.$2");
		
		//if(peso != '' && res.toString('utf8').substring(2, 8).length > 5){
		if(peso != ''){	
			peso = parseFloat(peso);
			//if(peso > 0 ){
			//if(peso > 0 && peso != pesoAux){
				//console.log('Peso auxiliar:', pesoAux)
				console.log('Peso:',peso );
				io.emit('serial:data',{
					Value: peso
				});
				pesoAux = peso;
				
			//}
		}
    });
});
