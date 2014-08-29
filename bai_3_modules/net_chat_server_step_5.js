var net = require('net'),
  Utils = require('./src/my_utils_step_2'),
  chatServer = net.createServer(),
  clientList = []
  ;

chatServer.on('connection', function(client) {
  client.write('Hi!\n');

  clientList.push(client);

  client.on('data', function(data) {
    for(var i=0; i<clientList.length; i+=1) {
      Utils.debug(data.toString());

      if (client !==clientList[i]) clientList[i].write(data)
    }
  });
});

chatServer.listen(9000, function(){
  Utils.error('net chat server listen on port 9000');
});
