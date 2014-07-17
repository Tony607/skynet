//This is the sender app
//It send message to the receiver device every 3 secs
//It also print out any received message payload

var io = require('socket.io-client');
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
			// Have not tested this properly yet
			// Send/Receive messages
			//For test purpose, we send data every 3 secs
			setInterval(function () {
				socket.emit("message", {
					"devices" : 'd4bc3851-0d2a-11e4-b13f-933e845654f9',// this is the receiver UUID
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
