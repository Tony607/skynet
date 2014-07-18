//This is the sender app
//It send message to the receiver device every 3 secs
//It also print out any received message payload

var io = require('socket.io-client');
socket = io.connect('http://localhost:3000', {
		port : 3000
	});
//This is the sender
// Replace 449cb1c1....cbd with your uuid and replace the token as well.
var myDevice = {
	uuid:	"b1783fb1-0e83-11e4-b12d-4dbc4a9ffc1e",
	token:	"iz9nsgoji88v9529ty27nbnsr8cfecdi"
};
// this is the receiver
var receiveDevice = {
	uuid:	"6fb35ac1-0e82-11e4-b12d-4dbc4a9ffc1e",
	//token:	"k5mvb6iokn4b1emidu31f3tuqaypsyvi"
}
socket.on('connect', function () {
	console.log('Requesting websocket connection to SkyNet');
	
	socket.on('identify', function (data) {
		console.log('Websocket connecting to SkyNet with socket id: ' + data.socketid);
		console.log('Sending device uuid: '+myDevice.uuid);
		socket.emit('identity', {
			uuid : myDevice.uuid,
			socketid : data.socketid,
			token : myDevice.token
		});
	});

	socket.on('notReady', function (data) {
		if (data.status == 401) {
			console.log('Device not authenticated with SkyNet');
		}
	});
	socket.on('ready', function (data) {
		if (data.status == 201) {
			console.log('Device authenticated with SkyNet');
			// Send/Receive messages
			//For test purpose, we send data every 3 secs
			setInterval(function () {
				socket.emit("message", {
					"devices" : receiveDevice.uuid,
					"payload" : {
						"serialin" : "Sender--->Value<" + parseInt(Math.random() * 100)//this is the data to send
					}
				});
			}, 3000)

			socket.on('message', function (msg) {
				//       console.log('message received', msg);
				//print any incoming message payload
				console.log(msg.payload);

			});
		}
	});
});
