const AWS = require ("aws-sdk");

const testconfig = {
  "apiVersion": "2012-08-10",
  "region":"us-east-1",
  "profile": "unit_test",
  "endpoint": "http://localhost:8000"
};
AWS.config.update(testconfig);
const db = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();
const slink = require('../slink');
const Slinker = require('../slinker');
const slinker = new Slinker(testconfig);

var fs = require('fs');


beforeAll(() => {
  return initialiseLocalDynamodDB()
     .then( () => db.waitFor("tableExists", {TableName: "Slink"}) )
     .then( seedLocalDynamodDB() );

});

afterAll(() => {
  return deleteTable()
    .then( () => db.waitFor("tableNotExists", {TableName: "Slink"}) );
});


function initialiseLocalDynamodDB() {
  console.log("Creating Slink table in DynamoDB. Please wait.");
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

function seedLocalDynamodDB() {
  console.log("Importing slinks into DynamoDB. Please wait.");

  var allSlinks = JSON.parse(fs.readFileSync('./test/slinker.seed.data.json', 'utf8'));

  allSlinks.forEach(function (slink) {
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
    console.log("Putting :", JSON.stringify(slink, null, 2));
    docClient.put(params, function(err, data) {
      if (err) {
        console.error("Unable to add slink", slink.uid, ". Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log("PutItem succeeded:", data);
      }
    });
  });
}

function deleteTable() {
  var params = {
    TableName : "Slink"
  };

  return db.deleteTable(params).promise();
}


test('create success', () => {
  expect.assertions(1);

  // create a test slink for saving to the DB
  var data = {
    intent: "BLACKBOOK",
    payload: {
      blackbooks: [
        "horsey99",
        "horsey21",
        "horsey3"
      ],
      url: "http://mytesturl"
    }
  };
  var newSlink = slink.getSlink(data);

  return slinker.create(newSlink).then(data => {
      // dynamodb doesn't return any data about the put
      expect(data).toBeTruthy();
  });
});

test('get success', () => {
  expect.assertions(1);
  return slinker.get('6JnSHgjWNElxW8Q')
    .then(data => {
      console.log(data);
      expect(data.Item.payload.url).toBe("http://jimbob");
    });
});

test('slinker create success', () => {
  Date.now = jest.fn(() => '2018-09-07T00:24:05.103Z')
  var data = {
    intent: "blackbook",
    payload: {
      blackbooks: [
        "horse1", "horse2"
      ]
    }
  };

  var newSlink = slink.getSlink(data);
  console.log(newSlink);
  expect(newSlink.uid).toBeDefined();
  expect(newSlink.intent).toEqual('URL');
  expect(newSlink.payload.blackbooks).toEqual(["horse1", "horse2"]);
  expect(newSlink.metadata.created).toEqual('2018-09-07T00:24:05.103Z');

});
