//This is the app which unregistered a device
var io = require('socket.io-client');
var fs = require('fs')
socket = io.connect('http://skynet.im', {
		port : 80
	});

socket.on('connect', function () {
	console.log('Requesting websocket connection to SkyNet');
	// Replace 449cb1c1....cbd with your uuid and replace the token as well.
	socket.on('identify', function (data) {
		console.log('Websocket connecting to SkyNet with socket id: ' + data.socketid);
		console.log('Sending device uuid: 449cb1c1-0de1-11e4-ba98-ed547cf24cbd');
		socket.emit('identity', {
			uuid : '449cb1c1-0de1-11e4-ba98-ed547cf24cbd',//This is the sender UUID
			socketid : data.socketid,
			token : 'jm9duwpozgvkuik9blgtmt4lys73z0k9'//This is the sender token
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
			socket.emit('unregister', {"uuid":"d6e4a441-0df3-11e4-ba98-ed547cf24cbd", "token": "09cvs306d4i49rudivjhz9ho9184zpvi"}, function (data) {
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
