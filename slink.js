const crypto = require('crypto');
const defaultUidLength = 15;

const intents = {
  URL: 'URL',
  BLACKBOOK: 'BLACKBOOK'
}


function _mapIntent(params){
  if (!params.hasOwnProperty('intent')) {
    throw new Error ('"intent" property is mandatory.')
  }
  switch (params.intent.toUpperCase()) {
    case intents.URL:
      return intents.URL;
    case intents.BLACKBOOK:
      return intents.URL;
    default:
      throw new Error('Unsupported intent type: ' + params.intent);
  }
}

function _addMetadata(){

  return {
   created: Date.now().valueOf(),
 }
};

function _randomUID () {
  var chars = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
  var rnd = crypto.randomBytes(defaultUidLength)
    , value = new Array(defaultUidLength)
    , len = len = Math.min(256, chars.length)
    , d = 256 / len

  for (var i = 0; i < defaultUidLength; i++) {
    value[i] = chars[Math.floor(rnd[i] / d)]
  };

  return value.join('');
};


exports.getSlink = function (params) {
  console.log(params);
  var uid = _randomUID();
  var intent = _mapIntent(params);
  var metadata = _addMetadata();
  return {
    uid: uid,
    intent: intent,
    payload: params.payload,
    metadata: metadata
  };
}

