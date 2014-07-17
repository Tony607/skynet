//This is the app which unregistered a device
var io = require('socket.io-client');
var fs = require('fs')
var filter = "123";

var myDevice = {
	uuid: "cf6a6d31-0df3-11e4-ba98-ed547cf24cbd",
	token: "007m329y08b3ce4s4iplrjd3ek9jxlxr"
};

var sensorDevice = {
	uuid: "449cb1c1-0de1-11e4-ba98-ed547cf24cbd",
	token: "jm9duwpozgvkuik9blgtmt4lys73z0k9"
};

socket = io.connect('http://skynet.im', {
		port : 80
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
			socket.emit('getdata', {"uuid":sensorDevice.uuid, "token": sensorDevice.token, "limit": 1}, function (data) {
			  console.log("Got It!\ttemperature="+data.data[0].temperature);
			});


		}
	});
});
