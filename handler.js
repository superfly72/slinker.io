'use strict';
const Slinker = require('slinker');
const slinker = new Slinker(db, 15);



module.exports.get = (event, context, cb) => slinker.get({
  parameters: {
    id: event.path.id
  }
});


module.exports.create = (event, context, cb) => slinker.create({
  body: event.body
});

