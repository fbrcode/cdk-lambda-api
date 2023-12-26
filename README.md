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

- `cdk bootstrap --profile cdk` - bootstrap CDK project
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

## Authentication with AWS Cognito

Create a new cognito `demo` user on console inside the user pool to test it out.

Or use AWS CLI for it:

```sh
# check how to create this properly

aws cognito-idp admin-create-user \
--user-pool-id us-west-1_IqbmJwdip \
--username demo \
--user-attributes Name=email,Value=demo@example.com \
--profile cdk | cat
```

Then validate the password with the following command:

```sh
aws cognito-idp admin-set-user-password \
--user-pool-id us-west-1_IqbmJwdip \
--username demo \
--password Demo-999 \
--permanent \
--profile cdk | cat
```

List groups:

```sh
aws cognito-idp list-groups \
--user-pool-id us-west-1_IqbmJwdip \
--output table \
--profile cdk | cat
```

```txt
------------------------------------------------------------
|                        ListGroups                        |
+----------------------------------------------------------+
||                         Groups                         ||
|+-------------------+------------------------------------+|
||  CreationDate     |  2023-12-25T21:32:40.623000-03:00  ||
||  GroupName        |  Administrators                    ||
||  LastModifiedDate |  2023-12-25T21:32:40.623000-03:00  ||
||  UserPoolId       |  us-west-1_IqbmJwdip               ||
|+-------------------+------------------------------------+|
```

Add user to Administrators group:

```sh
aws cognito-idp admin-add-user-to-group \
--user-pool-id us-west-1_IqbmJwdip \
--username demo \
--group-name Administrators \
--profile cdk | cat
```

Install the following Amplify libraries:

- `npm i -D aws-amplify@5.x` - integrates with Cognito (use amplify v5.x)
- `npm i -D @aws-amplify/auth@5.x` - used to have proper typings

> Note: Using [Amplify v5.x](https://docs.amplify.aws/javascript/prev/build-a-backend/auth/enable-sign-up/) (v6.x available now)

Check if the user is authenticated:

```sh
npm run auth-jwt-test
```

### Cognito Identity Pool

Enable Cognito Identity Pool by enhancing Auth stack with:

- Identity Pool
- Identity Pool Roles
- Attaching Roles (Authenticated and Unauthenticated) as Trust Relationships

Install the following library to manage Cognito Identity Pool providers:

- `npm i -D @aws-sdk/credential-providers`
