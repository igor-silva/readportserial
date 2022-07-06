const SerialPort = require('serialport');
const os = require('os');
const nodemailer = require('nodemailer');
const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
/*const port = new SerialPort( 'COM2',{
	baudRate: 9600,
  });*/


const port = new SerialPort('COM2',{ baudRate: 9600 }, function (err) {
	if (err) {
		const obj = os.networkInterfaces();
		let ip = '';

		//console.log(os.platform());
		//console.log(os.arch());
		//console.log(os.release());
		//console.log(os.type());
		//console.log(os.userInfo().username);

		for(var a in obj) {
			for (let b in obj[a]) {
				if (obj[a][b].family === 'IPv4' && obj[a][b].internal === false)
					ip = obj[a][b].address
					//console.log(b, obj[a][b]);	
			}
		}

		let msgError =
		`*******************************MICROJUNTAS********************************  \r\n	 
		Error ->  ${err.message}   (Não foi possível abrir a porta serial) \r\n
			\r\n
				========== HOSTNAME: ${os.hostname()} ========== \r\n
				========== IP: ${ip} ========== \r\n
				========== USER: ${os.userInfo().username} ========== \r\n
			
		`

		console.log( msgError );

		sendEmail(msgError)

		return false;

	}
});


const Readline = SerialPort.parsers.Readline;
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
      origin: '*',
    }
  });

var pesoAux = 0;
var cont = 0;
 
server.listen(3000, () => {
    console.log('Servidor online na porta:', server.address().port);
});

port.on('open', function () {


    port.on('data', function (res) {

		var peso = res.toString('utf8').substring(0, 8).replace(/(\d{1})?(\d{8})/, "$1.$2");
	
		//var peso = res.toString('utf8').substring(0, 8).replace(/(\d{1})?(\d{8})/, "$1.$2");
		
		if(peso != '' && res.toString('utf8').substring(0, 8).length > 5){
		//if(peso != ''){	
			peso = parseFloat(peso);
			//if(peso > 0 ){
			//if(peso > 0 && peso != pesoAux){
				//console.log('Peso auxiliar:', pesoAux)
				console.log('Peso '+cont++ +':',peso );
				io.emit('serial:data',{
					Value: peso
				});
				pesoAux = peso;
				
			//}
		}
    });
});


function sendEmail(text){

	let transporter = nodemailer.createTransport({
		host: 'smtp.office365.com',
		port: 587,
		auth: {
			user: "monitoramento@microjuntas.com.br",
			pass: "Monit@2018"
		}
	})

	message = {
		from: "monitoramento@microjuntas.com.br",
		to: "ti_geral@microjuntas.com.br",
		subject: "Erro balança de pesagem: " + os.hostname(),
		text: text
   }

   transporter.sendMail(message, function(error, info){
		if (error) {
		console.log(error);
		} else {
		console.log('Email sent: ' + info.response);
		}
  	});
}