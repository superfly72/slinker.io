const AWS = require ("aws-sdk");

class Slinker {

  constructor(config){
    AWS.config.update(config);
    this.docClient = new AWS.DynamoDB.DocumentClient();
  }

  create (slink) {
    console.log("Saving slink", JSON.stringify(slink));
    var params = {
      Item: {
        "uid": slink.uid,
        "intent": slink.intent ,
        "payload": slink.payload,
        "metadata": slink.metadata
      },
      TableName: "Slink",
      ConditionExpression: "attribute_not_exists(uid)"   // only succeed if this uid key doesn't already exist
    };
    console.log("DB Params", JSON.stringify(params, undefined, 2));
    return this.docClient.put(params).promise();
  };

  get (uid) {
    console.log("getSlink", uid);
    var params = {
      Key: {
        "uid": uid
      },
      TableName: "Slink"
    };
    return this.docClient.get(params).promise();
  };
}

module.exports = Slinker;