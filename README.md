# AWS CDK TypeScript Quick Start

Project with DynamoDb, Lambda function and API Gateway.

## Project commands

- `npm init -y` - initialize project package manager (package.json)
- `git init` - initialize git repository
- `npm install -g aws-cdk` - install AWS CDK globally
- `npm i -D aws-cdk aws-cdk-lib constructs` - install AWS CDK locally
- `npm i -D typescript ts-node` - install TypeScript locally
- `npm i -D @types/node` - install Node.js types locally
- `aws configure --profile cdk` # setup a new aws profile for stack deployment
- `npm i -D @types/aws-lambda` - install AWS Lambda types locally
- `npm i -D esbuild` - install esbuild locally
- `npm i uuid` - install uuid package
- `npm i -D @types/uuid` - install uuid types locally
- `npm i -D @aws-sdk/client-s3` - install AWS S3 client locally
- `npm i -D @aws-sdk/client-dynamodb` - install AWS DynamoDB client locally

## CDK commands

- `cdk synth --all --profile cdk` - initialize CDK project
- `cdk deploy --all --profile cdk` - deploy CDK stack
- `cdk destroy --all --profile cdk` - destroy CDK stack

Deploy skipping approvals

- `cdk deploy --all --require-approval never --profile cdk`

## Debugging lambda best practices (VSCODE)

Make sure you have `ts-node` added to your `devDependencies` in `package.json` file.

- `npm i -D ts-node`

On VSCODE, go to the debug tab (shift + cmd + D) and click on the link to create a new launch configuration (`launch.json`) selecting `Node.js` option.

Add the following configuration to the `launch.json` file:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug local",
      "runtimeArgs": ["-r", "ts-node/register"],
      "args": ["${relativeFile}"],
      "env": {
        "AWS_PROFILE": "cdk"
      }
    }
  ]
}
```

- `AWS_PROFILE` defines the AWS CLI profile to be used.

Mark a breakpoint on the lambda function you want to debug.

On the debug tab, select the `Debug local` option, select `debug/launcher.ts` file and click on the play button to start debugging.
