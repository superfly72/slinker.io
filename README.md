# slinker.io
Smart Linker www.slinker.link


## Prerequisites

There are a few things you will need to setup before using the Serverless Platform. This guide will walk you through each of these steps.
* Should have node 8.x or later installed
* Should have a new AWS IAM User with full admin privileges
* Should have the Serverless Framework installed (incluldes CLI commands)
* Should have your AWS credentials configured with the Serverless Framework
* Should have an account setup on https://serverless.com (https://dashboard.serverless.com/../../applications/slinker-dev)
* Should have downloaded https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html and running for local tests
* Should have created a unit test profile for AWS CLI ``aws configure --profile unit_test``
* Should have a registered certified domain (e.g. https://www.slinker.link)


## Development

### Local testing - Unit testing with jest

Start the local DynamoDB install.
```bash
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```

then run the unit tests
```bash
npm test
```

### Local testing - Invoke your Service's function with serverless

Invokes a Function locally and returns logs.

```bash
serverless invoke local -f createSlink -l -p test/post.request.json 

serverless invoke local -f getSlink -l -p test/get.request.json 
```


### Deploy the Service

Use this when you have made changes to your Functions, Events or Resources in `serverless.yml` or you simply want to deploy all changes within your Service at the same time.

```bash
serverless deploy -v
```


### Fetch the Function Logs

Open up a separate tab in your console and stream all logs for a specific Function using this command.

```bash
serverless logs -f getSlink -t
```

### Redeploy an individual Function
Use this to quickly upload and overwrite your function code, allowing you to develop faster.

```bash
serverless deploy function -f createSlink
```

## Cleanup

### Removing a service

If at any point, you no longer need your Service, you can run the following command to remove the Functions, Events and Resources that were created, and ensure that you don't incur any unexpected charges.

```bash
serverless remove
```


## URL
Once deployed, the functions can be tested using curl 

Retrieve a slink
curl -X GET \
  https://www.slinker.link/slink/abcsdfsdfsdd \
  -H 'authorization: <Bearer token>'
  -H 'cache-control: no-cache' 
  
  
Create a slink
curl -X POST \
  https://www.slinker.link/slink \
  -H 'authorization: <Bearer token>'
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
    "intent": "BLACKBOOK",
    "payload": {
      "blackbooks": [
        "winx",
        "red rum"
      ]
    }
}'


