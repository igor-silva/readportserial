const SerialPort = require('serialport');
const port = new SerialPort( 'COM1',{
	baudRate: 9600,
  });


const Readline = SerialPort.parsers.Readline;
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

const express = require("express");

const http = require("http");

const app = express();
const server = http.createServer(app);
 
server.listen(3001, () => {
    console.log('Servidor online na porta:', server.address().port);
});

port.write('open', function() {
	setInterval(() => write(),1000)
	
});


function write(){

	let _random = (Math.
		random() +1).toString(10).substring(0, 5);
	let _randomMin = '00.299'
	let _randomMax = '01.253'
	console.log(_randomMin);
	port.write(_randomMin, function(err) {
			
		if (err) {
		return console.log('Error on write: ', err.message);
		}
		console.log('enviado');
	})
}
