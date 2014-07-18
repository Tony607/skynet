//receive mqtt message, print out the temperature data
// and send local temperature data back to the sender
var mqtt = require("mqtt");

var myDevice = {
	uuid: "cf6a6d31-0df3-11e4-ba98-ed547cf24cbd",
	token: "007m329y08b3ce4s4iplrjd3ek9jxlxr"
};
var anotherDevice = {
	uuid: "449cb1c1-0de1-11e4-ba98-ed547cf24cbd",
	token: "jm9duwpozgvkuik9blgtmt4lys73z0k9"
};
var options = {
	"uuid": myDevice.uuid,
	"token": myDevice.token,
	"qos": 0
	};
var replydata = {
	"devices": anotherDevice.uuid,
	"payload": {
	  "temperature":parseInt(Math.random() * 100)
	}
  };	
var mqttsettings = {
    keepalive: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clientId: options.uuid,
    username: options.uuid,
    password: options.token,
    reconnectPeriod: options.reconnectPeriod || 5000
  };
var mqttclient = mqtt.createClient(options.port || options.mqttport || 1883,
                                        options.host || options.mqtthost || options.server || 'mqtt.skynet.im',
                                        mqttsettings);

    mqttclient.on('connect', function(a, b){
      console.log('...connected via mqtt',a,b);
      mqttclient.subscribe(options.uuid, {qos: options.qos});
    });

    mqttclient.on('close', function(){
      console.log('...closed via mqtt');
    });


    mqttclient.on('error', function(error){
      console.log('error connecting via mqtt');
    });

	//receive the message
    mqttclient.on('message', function(topic, data){
      try{
        if(typeof data === 'string' && data.indexOf('{') === 0){
          data = JSON.parse(data);
          if(data.data.payload.temperature){
			//only print the temperature data
            console.log("received temperature = ", data.data.payload.temperature);
			//update temperature and send message back to the sender
			replydata.payload.temperature = parseInt(Math.random() * 100);
			mqttclient.publish('message', JSON.stringify(replydata), {qos: options.qos});
          }
        }

      }catch(exp){
        console.log('error on message', exp);
      }
    });