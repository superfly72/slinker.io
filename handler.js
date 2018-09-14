'use strict';
const Slinker = require('./lib/slinker');
const slinker = new Slinker();

module.exports.get = (event, context, callback) =>  {
  console.log("Get handler invoked ", JSON.stringify(event));
  slinker.get(event.pathParameters.uid, callback);
};


module.exports.create = (event, context, callback) => {
  console.log("Create handler invoked ",  JSON.stringify(event));

  // Bit hacky but depending on the the Lambda proxy Integration or Lambda Integration, the event object may
  // be a string representation of the entire request so we need to parse the body to JSON if it is.
  var data = event.body;
  if (typeof data == 'string') {
    data = JSON.parse(event.body);
  }

  slinker.create(data, callback);
};

