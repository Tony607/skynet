//slave app, send sensor data to master
var skynet = require('skynet-mqtt');

var myDevice = {
	uuid: "449cb1c1-0de1-11e4-ba98-ed547cf24cbd",
	token: "jm9duwpozgvkuik9blgtmt4lys73z0k9"
};

var masterDevice = {
	uuid: "cf6a6d31-0df3-11e4-ba98-ed547cf24cbd",
	token: "007m329y08b3ce4s4iplrjd3ek9jxlxr"
};

var conn = skynet.createConnection({
  "uuid": myDevice.uuid,
  "token": myDevice.token,
  "qos": 0, // MQTT Quality of Service (0=no confirmation, 1=confirmation, 2=N/A)
  //"host": "localhost", // optional - defaults to skynet.im
  //"port": 1883  // optional - defaults to 1883
});

conn.on('ready', function(){

  console.log('UUID AUTHENTICATED!');

  //Listen for messages
  conn.on('message', function(message){
    console.log('message received', message);
  });


  // Send a message to another device
  conn.message({
    "devices": masterDevice.uuid,
    "payload": {
      "skynet":"online"
    }
  });


  // Broadcast a message to any subscribers to your uuid
  conn.message({
    "devices": "*",
    "payload": {
      "hello":"skynet"
    }
  });


  // Subscribe to broadcasts from another device
  conn.subscribe(masterDevice.uuid);

	setInterval(function () {
		console.log("sending data...");
		//conn.data({temperature: parseInt(Math.random() * 100), windspeed: parseInt(Math.random() * 100)});
		conn.message({
			"devices": masterDevice.uuid,
			"payload": {
			  "temperature":parseInt(Math.random() * 100)
			}
		  });
	}, 3000)
  // Log sensor data to skynet
  

});