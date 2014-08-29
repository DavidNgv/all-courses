//my_module_1.js
var myObject = {"name": "Nguyen Van Hung"};
var _internalVar = 'Something';

exports.add = function(a, b) { return (a+b); };
exports.sub = function (a, b) { return (a-b); };
exports.myObject = myObject;

