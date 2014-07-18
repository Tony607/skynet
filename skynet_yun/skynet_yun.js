var io = require('socket.io-client')
socket = io.connect('http://skynet.im', {
    port: 80
});
console.log('Launching SkyNet Node>>>');
var myDevice = {
	uuid: "cf6a6d31-0df3-11e4-ba98-ed547cf24cbd",
	token: "007m329y08b3ce4s4iplrjd3ek9jxlxr"
};

var remoteDevice = {
	uuid: "449cb1c1-0de1-11e4-ba98-ed547cf24cbd",
	token: "jm9duwpozgvkuik9blgtmt4lys73z0k9"
};


// set up serialport to connect to the onboard atmega32u4
var com = require("serialport");
var serialPort = new com.SerialPort("/dev/ttyATH0", {
  baudrate: 9600,
  parser: com.parsers.readline('\r\n')
});


socket.on('connect', function(){
  console.log('Requesting websocket connection to SkyNet');
// Replace 623dd....112c with your uuid and replace the token as well.
  socket.on('identify', function(data){
    console.log('Websocket connecting to SkyNet with socket id: ' + data.socketid);
    console.log('Sending device uuid: '+myDevice.uuid);
    socket.emit('identity', {uuid: myDevice.uuid, socketid: data.socketid, token: myDevice.token});
  });

  socket.on('notReady', function(data){
    if (data.status == 401){
      console.log('Device not authenticated with SkyNet');
    }
  });
  socket.on('ready', function(data){
    if (data.status == 201){
      console.log('Device authenticated with SkyNet');


serialPort.on("open", function () {
  console.log('open');

  });

  serialPort.on('data', function(data) {
    console.log('data received: ' + data);


    // Send/Receive messages
      socket.emit("message",{
        "devices": remoteDevice.uuid,
        "payload": {
          "serialin": data}
      });

  });


 socket.on('message', function(msg){
//       console.log('message received', msg);

console.log(msg.payload);

// Writing msg.payload directly to the serialport produces weird 
// results. Instead we check the message and send out the right number to be sure.

if(msg.payload == "1"){

serialPort.write("1");
}else if(msg.payload == "2"){

serialPort.write("2");
}else if(msg.payload == "3"){

serialPort.write("3");
}else if(msg.payload == "0"){

serialPort.write("0");
}
      
     


   });

  


    }
  });
});
