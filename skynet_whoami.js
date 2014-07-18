//This is the app which find those devices matching a specific criteria
var io = require('socket.io-client');
var myDevice = {
	uuid:	"b1783fb1-0e83-11e4-b12d-4dbc4a9ffc1e",
	token:	"iz9nsgoji88v9529ty27nbnsr8cfecdi"
};
socket = io.connect('http://localhost:3000', {
		port : 3000
	});

socket.on('connect', function () {
	console.log('Requesting websocket connection to SkyNet');
	// Replace 449cb1c1....cbd with your uuid and replace the token as well.
	socket.on('identify', function (data) {
		console.log('Websocket connecting to SkyNet with socket id: ' + data.socketid);
		console.log('Sending device uuid: '+myDevice.uuid);
		socket.emit('identity', {
			uuid : myDevice.uuid,//This is the sender UUID
			socketid : data.socketid,
			token : myDevice.token//This is the sender token
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
			socket.emit('whoami', {"uuid":myDevice.token}, function (data) {
			  console.log(data);
			});

			// socket.on('message', function (msg) {
				// //       console.log('message received', msg);
				// //print any incoming message payload
				// console.log(msg.payload);

			// });
		}
	});
});
