const crypto = require('crypto');
const config = require('../config.json');

const intents = {
  URL: 'URL',
  BLACKBOOK: 'BLACKBOOK'
}

function _validate(data) {
  if (!data.hasOwnProperty('intent')) {
    throw new Error ('intent attribute is mandatory.');
  }

  if (!(data.intent.toUpperCase() in intents)) {
    throw new Error ('Unsupported intent type ' + data.intent);
  }
}

function _mapIntent(params){
  switch (params.intent.toUpperCase()) {
    case intents.URL:
      return intents.URL.valueOf();
    case intents.BLACKBOOK:
      return intents.BLACKBOOK.valueOf();
    default:
      throw new Error ('Unsupported intent type ' + params.intent);
  }
}

function _addMetadata(uid){
  return {
   created: Date.now().valueOf(),
   url_self: config.url_domain + '/' + uid
 }
};

function _randomUID () {
  var chars = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
  var rnd = crypto.randomBytes(config.uid_length)
    , value = new Array(config.uid_length)
    , len = len = Math.min(256, chars.length)
    , d = 256 / len

  for (var i = 0; i < config.uid_length; i++) {
    value[i] = chars[Math.floor(rnd[i] / d)]
  };

  return value.join('');
};


function getSlink (data) {
  try {
    _validate(data);
  } catch (error) {
    throw(error);
  }

  var uid = _randomUID();
  var intent = _mapIntent(data);
  var metadata = _addMetadata(uid);
  return {
    uid: uid,
    intent: intent,
    payload: data.payload,
    metadata: metadata
  };
}

module.exports.getSlink = getSlink;