var fs = require('fs');
var printf = require('util').format;
var EventEmitter = require('events').EventEmitter;
var myEmitter = new EventEmitter();

var resultCount = 0;
var resultData = '';
myEmitter.on('data', function(result){
  resultCount ++;
  resultData += printf('Result of %s: %s \n', resultCount, result);

  if (resultCount==4) {
    console.info('Getting data of: ', resultCount);
    console.info(resultData);
  } else {
    console.info('Getting data of: ', resultCount);
  }
}).on('error', function(err){
  console.error(err);
});

for (var i=1; i<=4; i++) {
  console.info('Reading data of: ', i);
  fs.readFile(printf('./net_chat_server_step_%s.js', i), function(err, data){
    if (err) {
      myEmitter.emit('error', err);
    } else {
      myEmitter.emit('data', data.toString());
    }
  })
}
