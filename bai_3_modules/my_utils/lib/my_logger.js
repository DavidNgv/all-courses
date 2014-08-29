(function() {
  var MyLogger, MyStringUtils, _, __myConsole, __myLog,
    __slice = [].slice;

  _ = require('underscore');

  __myConsole = console;

  MyStringUtils = require('./my_string_utils');

  __myLog = function(logLevel, args) {
    var messages, msg, _i, _len;
    messages = '';
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      msg = args[_i];
      messages += _.isString(msg) ? msg : JSON.stringify(msg, null, '\t') + ' ';
    }
    messages = MyStringUtils.getDateTimeStr(logLevel) + MyStringUtils.colorString(logLevel, messages);
    __myConsole[this.functionName[logLevel]](messages);
  };

  MyLogger = (function() {
    function MyLogger() {}

    MyLogger.functionName = {
      'log': 'log',
      'debug': 'info',
      'warn': 'warn',
      'error': 'error'
    };

    MyLogger.log = function() {
      var msgs;
      msgs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _.bind(__myLog, this, 'log', msgs)();
    };

    MyLogger.debug = function() {
      var msgs;
      msgs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _.bind(__myLog, this, 'debug', msgs)();
    };

    MyLogger.warn = function() {
      var msgs;
      msgs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _.bind(__myLog, this, 'warn', msgs)();
    };

    MyLogger.error = function() {
      var msgs;
      msgs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _.bind(__myLog, this, 'error', msgs)();
    };

    return MyLogger;

  })();

  module.exports = MyLogger;

}).call(this);
