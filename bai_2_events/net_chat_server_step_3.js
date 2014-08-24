var net = require('net'),
  Utils = require('./src/utils_step_2'),
  chatServer = net.createServer();

chatServer.on('connection', function(client) {
  client.write('Hi!\n');
  client.on('data', function(data) {
    console.log(data.toString());
  })
});

chatServer.listen(9000, function(){
  Utils.writeLog('net chat server listen on port 9000');
});
