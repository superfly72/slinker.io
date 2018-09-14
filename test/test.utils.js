const AWS = require ("aws-sdk");
const fs = require('fs');
let db;
let docClient;

exports.initialiseConfig = function (config){
  AWS.config.update(config);
  db = new AWS.DynamoDB();
  docClient = new AWS.DynamoDB.DocumentClient();
}


exports.initialiseLocalDynamodDB =  function () {
  console.log("Creating Slink table in local DynamoDB. Please wait...");
  var params = {
    TableName: 'Slink',
    KeySchema: [
      {
        AttributeName: 'uid',
        KeyType: 'HASH',
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'uid',
        AttributeType: 'S',
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10,
    },
  };

  return db.createTable(params).promise();
}

exports.seedLocalDynamodDB = function () {
  console.log("Importing slinks into DynamoDB. Please wait...");

  var allSlinks = JSON.parse(fs.readFileSync('./test/slinker.seed.data.json', 'utf8'));

  return allSlinks.forEach(function (slink) {
    var params = {
      ReturnConsumedCapacity: 'TOTAL',
      TableName: "Slink",
      Item: {
        'uid': slink.uid,
        'intent': slink.intent,
        'payload': slink.payload,
        'metadata': slink.metadata
      }
    };
    //console.log("Putting :", JSON.stringify(slink, null, 2));
    docClient.put(params, function(err, data) {
      if (err) {
        console.error("Unable to add slink", slink.uid, ". Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log("PutItem succeeded:", data);
      }
    });
  });
}

exports.waitForTableCreated = function (){
  return db.waitFor("tableExists", {TableName: "Slink"});
}

exports.waitForTableDeleted = function (){
  return db.waitFor("tableNotExists", {TableName: "Slink"});
}

exports.deleteTable = function () {
  var params = {
    TableName : "Slink"
  };
  return db.deleteTable(params).promise();
}