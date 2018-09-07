# slinker.io
Smart Linker


## Prerequisites

There are a few things you will need to setup before using the Serverless Platform. This guide will walk you through each of these steps.
* Should have node 6.x or later installed
* Should have a new AWS IAM User with full admin privileges
* Should have the Serverless Framework installed
* Should have your AWS credentials configured with the Serverless Framework
* Should have an account setup on https://serverless.com (https://dashboard.serverless.com/tenants/superfly72/applications/slinker-dev)
* Should have downloaded https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html
* Should have created a unit test profile for AWS CLI ``aws configure --profile unit_test``


## Development

### Starting local DynamoDB

```bash
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```


### Deploy the Service

Use this when you have made changes to your Functions, Events or Resources in `serverless.yml` or you simply want to deploy all changes within your Service at the same time.

```bash
serverless deploy -v
```

### Invoke your Service's function

Invokes a Function and returns logs.

```bash
serverless invoke -f create -l
```

### Fetch the Function Logs

Open up a separate tab in your console and stream all logs for a specific Function using this command.

```bash
serverless logs -f create -t
```

### Redeploy an individual Function
Use this to quickly upload and overwrite your function code, allowing you to develop faster.

```bash
serverless deploy function -f create
```

## Cleanup

### Removing a service

If at any point, you no longer need your Service, you can run the following command to remove the Functions, Events and Resources that were created, and ensure that you don't incur any unexpected charges.

```bash
serverless remove
```