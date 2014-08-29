var fs = require('fs');
var async = require('async');
var printf = require('util').format;


var file_array = [];
for (var i=4; i<=7; i++) {
    file_array.push(printf('./net_chat_server_step_%s.js', i));
}

async.map(file_array,
    function(fileName, callback) {
        console.info('Reading data of: ', fileName);
        fs.readFile(fileName, function(err, data){
            if (err) {
                callback(err, null);
            } else {
                console.info('Getting data of: ', fileName);
                callback(null, data.toString());
            }
        })
    },
    function(err, results){
        if (err) {
            console.error(err);
        } else {
            var resultCount = 0;
            var resultData = '';
            for (var index in results) {
                var each_result = results[index];
                resultCount ++;
                resultData += printf('Result %s: %s \n', resultCount, each_result);
            }
            console.info(resultData);
        }
    }
);