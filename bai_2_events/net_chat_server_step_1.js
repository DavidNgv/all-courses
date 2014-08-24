var net = require('net'),
  utils = require('./src/utils_step_1'),
  chatServer = net.createServer();

chatServer.on('connection', function(client) {
  client.write('Hi!\n');
  client.write('Bye!\n');
  client.end()
})

chatServer.listen(9000, function(){
  utils.writeLog(utils.getDateTimeStr() + ': net chat server listen on port 9000');
});
