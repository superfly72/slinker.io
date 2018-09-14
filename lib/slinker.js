const AWS = require ("aws-sdk");
const slink = require("./slink");
const config = require('../config.json');

class Slinker {

  constructor(config){
    if (config) {
      AWS.config.update(config);
    }
    this.docClient = new AWS.DynamoDB.DocumentClient();
  }

  create (data, callback) {
    console.log("Creating slink with payload:", JSON.stringify(data));

    try {
      var s = slink.getSlink(data);
    } catch (err) {
      console.error(err);
      callback({
        statusCode: err.statusCode || 501,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "error": err.message })
      });
      return;
    }


    var params = {
      Item: {
        "uid": s.uid,
        "intent": s.intent ,
        "payload": s.payload,
        "metadata": s.metadata
      },
      ReturnValues: "NONE",
      TableName: config.dynamodb_table,
      ConditionExpression: "attribute_not_exists(uid)"   // only succeed if this uid key doesn't already exist
    };
    console.log("Creating slink with database params:", JSON.stringify(params));

    // write the slink to the database
    this.docClient.put(params, (error, result) => {
      // handle potential errors
      if (error) {
        console.error(error);
        callback({
          statusCode: error.statusCode || 501,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ "error": error.message })
        });
        return;
      }

      // create a success response
      const response = {
        statusCode: 200,
        body: JSON.stringify({ url: s.metadata.url_self })
       };
      callback(null, response);
    });

  };

  get (uid, callback) {
    console.log("Getting slink ", uid);
    var params = {
      Key: {
        "uid": uid
      },
      TableName: config.dynamodb_table
    };
    console.log("Database params ", JSON.stringify(params));
    this.docClient.get(params, (error, result) => {
      // handle potential errors
      if (error) {
        console.error(error);
        callback({
          statusCode: error.statusCode || 500,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ "error": error.message })
        });
        return;
      }

      // create a success response and return the Item  retrieved
      if (result.Item) {
        const response = {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result.Item)
        };
        callback(null, response);
        return;
      }
      // create a success response with Not Found Message as there was no matching Item
      const response = {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "message": "No matching slink for uid " + uid })
      };
      callback(null, response);
    });

  };
}

module.exports = Slinker;