(function() {
    var BaseModule, MyClientInfo, MyLogger, MyUtils,
        __hasProp = {}.hasOwnProperty,
        __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key)) child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }

            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };

    BaseModule = require('./lib/base_module');

    MyLogger = require('./lib/my_logger');

    MyClientInfo = require('./lib/my_client_info');

    MyUtils = (function(_super) {
        __extends(MyUtils, _super);

        function MyUtils() {
            return MyUtils.__super__.constructor.apply(this, arguments);
        }

        MyUtils.extend(MyLogger);

        MyUtils.extend(MyClientInfo);

        return MyUtils;

    })(BaseModule);

    module.exports = MyUtils;

}).call(this);
