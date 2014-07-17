//This is the app which register a device on skynet.im and save the
//uuid and token to file "devices.txt"
var io = require('socket.io-client');
var fs = require('fs')
var outputfile = "devices.txt"
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
			socket.emit('register', {"key":"123"}, function (data) {
				console.log("uuid: "+data.uuid);
				console.log("token: "+data.token);
				var appendText = "{\n\tuuid:\t"+data.uuid+"\n"+"\ttoken:\t"+data.token+"\n}\n";
				console.log("====>>Writeing to File"+outputfile+"...");
				fs.appendFile(outputfile, appendText, function(err) {
					if(err) {
						console.log(err);
						process.exit(code=1);
					} else {
						console.log("The device info was saved to "+outputfile+"!");
						process.exit(code=0);
					}
				}); 
			});

			// socket.on('message', function (msg) {
				// //       console.log('message received', msg);
				// //print any incoming message payload
				// console.log(msg.payload);

			// });
		}
	});
});
