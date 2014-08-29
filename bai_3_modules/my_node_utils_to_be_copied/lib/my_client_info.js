(function() {
  var MyClientInfo;

  MyClientInfo = (function() {
    function MyClientInfo() {}

    MyClientInfo.getClientIp = function(req) {
      var forwardedIps, x_ip;
      x_ip = null;
      forwardedIps = req.headers['x-forwarded-for'];
      if (forwardedIps) {
        x_ip = forwardedIps.split(',')[0];
      }
      if (x_ip == null) {
        x_ip = req.connection.remoteAddress;
      }
      return x_ip;
    };

    return MyClientInfo;

  })();

  module.exports = MyClientInfo;

}).call(this);
