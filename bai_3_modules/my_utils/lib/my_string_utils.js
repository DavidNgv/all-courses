(function() {
  var MyStringUtils, cliColor;

  cliColor = require('cli-color');

  MyStringUtils = (function() {
    function MyStringUtils() {}

    MyStringUtils.getDateTimeStr = function(level) {
      var date, dateStr, result, timeStr;
      result = '';
      date = new Date();
      dateStr = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
      timeStr = date.toLocaleTimeString();
      result = dateStr + ' ' + timeStr + ': ';
      result = this.colorString(level, result);
      return result;
    };

    MyStringUtils.firstUpperCase = function(str) {
      return str.substr(0, 1).toUpperCase() + str.substr(1, str.length - 1);
    };

    MyStringUtils.colorString = function(level, msg) {
      switch (level) {
        case 'log':
          return cliColor.black.bgWhite.underline(msg);
        case 'debug':
          return cliColor.black.bgGreen.underline(msg);
        case 'warn':
          return cliColor.red.bgYellow.underline(msg);
        case 'error':
          return cliColor.white.bgRed.underline(msg);
      }
      return msg;
    };

    return MyStringUtils;

  })();

  module.exports = MyStringUtils;

}).call(this);
