//This the receiver app,
//I print out any received message payload and
//send a new message back to the sender
var io = require('socket.io-client');
socket = io.connect('http://skynet.im', {
		port : 80
	});

socket.on('connect', function () {
	console.log('Requesting websocket connection to SkyNet');
	// Replace 623dd....112c with your uuid and replace the token as well.
	socket.on('identify', function (data) {
		console.log('Websocket connecting to SkyNet with socket id: ' + data.socketid);
		console.log('Sending device uuid: d4bc3851-0d2a-11e4-b13f-933e845654f9');
		socket.emit('identity', {
			uuid : 'd4bc3851-0d2a-11e4-b13f-933e845654f9',
			socketid : data.socketid,
			token : '5ira2ftm2mb49529miqzyk25z7kz9f6r'
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
			// Have not tested this properly yet
			// Send/Receive messages
			

			socket.on('message', function (msg) {
				//       console.log('message received', msg);
				socket.emit("message", {
					"devices" : '449cb1c1-0de1-11e4-ba98-ed547cf24cbd',
					"payload" : {
						"serialin" : "Got_It--->NewValue<"+parseInt(Math.random()*100)
					}
				});
				console.log(msg.payload);

			});
		}
	});
});
