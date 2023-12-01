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
- `npm i uuid @types/uuid` - install uuid package and types locally

## CDK commands

- `cdk synth --all --profile cdk` - initialize CDK project
- `cdk deploy --all --profile cdk` - deploy CDK stack
- `cdk deploy --all --require-approval never --profile cdk` - deploy CDK stack without approval
- `cdk destroy --all --profile cdk` - destroy CDK stack
