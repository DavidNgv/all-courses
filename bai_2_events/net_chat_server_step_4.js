//net_chat_server_step_4

var net = require('net'),
  Utils = require('./src/utils_step_2'),
  chatServer = net.createServer(),
  clientList = []
  ;

chatServer.on('connection', function(client) {
  client.write('Hi!\n');

  clientList.push(client);

  client.on('data', function(data) {
//    console.log(data.toString());
    for(var i=0; i<clientList.length; i+=1) {
      //write this data to all clients
      clientList[i].write(data)
    }
  });
});

chatServer.listen(9000, function(){
  Utils.writeLog('net chat server listen on port 9000');
});
