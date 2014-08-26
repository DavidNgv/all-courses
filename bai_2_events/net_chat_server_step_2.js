//net_chat_server_step_2

var net = require('net'),
  Utils = require('./src/utils_step_2'),
  chatServer = net.createServer();

chatServer.on('connection', function(client) {
  client.write('Hi!\n');
  client.write('Bye!\n');
  client.end()
})

chatServer.listen(9000, function(){
  Utils.writeLog('net chat server listen on port 9000');
});
