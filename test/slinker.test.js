const slink = require('../lib/slink');
const Slinker = require('../lib/slinker');
const test_utils = require('./test.utils');
const config = require('../config.json');

let slinker;


/**
 * Set Up - Create test database (using dynamodb local) and populate it with some test records
 */
beforeAll(() => {
  const testconfig = {
    "apiVersion": "2012-08-10",
    "region":"us-east-1",
    "profile": "unit_test",
    "endpoint": "http://localhost:8000"
  };
  slinker = new Slinker(testconfig);

  test_utils.initialiseConfig(testconfig);
  return test_utils.initialiseLocalDynamodDB()
     .then( () => test_utils.waitForTableCreated() )
     .then( () => test_utils.seedLocalDynamodDB() );

});

/**
 * Tear Down - Delete table and data
 */
afterAll(() => {
  return test_utils.deleteTable()
    .then( () => test_utils.waitForTableDeleted());
});




test('slinker create success', (done) => {
  var slink_body = {
    intent: "BLACKBOOK",
    payload: {
      blackbooks: [
        "horsey99",
        "horsey21",
        "horsey3"
      ]
    }
  };

  function callback(err, data) {
    console.log('result :', JSON.stringify(data));
    var responseBody = JSON.parse(data.body);
    expect(responseBody.url).toContain(config.url_domain);
    expect(data.statusCode).toBe(200);
    done();
  }
  slinker.create(slink_body, callback);
})





test('slinker get success', (done) => {
  function callback(err, data) {
    console.log('result:', JSON.stringify(data));
    var responseBody = JSON.parse(data.body);
    expect(responseBody.metadata.url_self).toBe("https://slink.io/6JnSHgjWNElxW8Q");
    expect(data.statusCode).toBe(200);
    done();
  }

  slinker.get('6JnSHgjWNElxW8Q', callback);

});


test('slinker get fail due to no matching record in the DB', (done) => {
  function callback(err, data) {
    console.log('result:', JSON.stringify(data));
    var response = data.statusCode;
    expect(response).toBe(404);
    done();
  }
  slinker.get('nosuchkey', callback);
});



test('slink create from data success', () => {
  Date.now = jest.fn(() => '2018-09-07T00:24:05.103Z')
  var slink_body = {
    intent: "blackbook",
    payload: {
      blackbooks: [
        "horse1", "horse2"
      ]
    }
  };

  var newSlink = slink.getSlink(slink_body);
  expect(newSlink.uid).toBeDefined();
  expect(newSlink.intent).toEqual('BLACKBOOK');
  expect(newSlink.payload.blackbooks).toEqual(["horse1", "horse2"]);
  expect(newSlink.metadata.created).toEqual('2018-09-07T00:24:05.103Z');
});


test('slink create from data fail due to missing "intent"', () => {
  var slink_body = {
    //intent: "no intent provided",
    payload: {
      blackbooks: [
        "horse1", "horse2"
      ]
    }
  };
  expect(() => slink.getSlink(slink_body)).toThrowError('intent attribute is mandatory.');
});



test('slink create from data fail due to unsupported "intent"', () => {
  var slink_body = {
    intent: "myNewIntent",
    payload: {
      blackbooks: [
        "horse1", "horse2"
      ]
    }
  };
  expect(() => slink.getSlink(slink_body)).toThrowError('Unsupported intent type myNewIntent');
});