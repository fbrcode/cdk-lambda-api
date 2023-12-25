import { Stack, StackProps } from "aws-cdk-lib";
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  LambdaIntegration,
  MethodLoggingLevel,
  MethodOptions,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { IUserPool } from "aws-cdk-lib/aws-cognito";
import { RestMethod } from "../../types/rest";
import { Auth } from "aws-amplify";

interface ApiStackProps extends StackProps {
  spacesLambdaIntegration: LambdaIntegration;
  userPool: IUserPool;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "SpacesApi", {
      deployOptions: {
        metricsEnabled: true,
        loggingLevel: MethodLoggingLevel.ERROR,
        variables: {
          LogGroup: `/aws/apigateway/${this.stackName}`,
        },
        stageName: "dev",
        description: "Development stage",
      },
      deploy: true,
    });

    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      "SpacesApiAuthorizer",
      {
        cognitoUserPools: [props.userPool],
        identitySource: "method.request.header.Authorization",
      }
    );
    authorizer._attachToApi(api);

    const optionsWithAuth: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: { authorizerId: authorizer.authorizerId },
    };

    const spacesResource = api.root.addResource("spaces");

    spacesResource.addMethod(
      RestMethod.GET,
      props.spacesLambdaIntegration,
      optionsWithAuth
    );

    spacesResource.addMethod(
      RestMethod.POST,
      props.spacesLambdaIntegration,
      optionsWithAuth
    );

    spacesResource.addMethod(
      RestMethod.PUT,
      props.spacesLambdaIntegration,
      optionsWithAuth
    );

    spacesResource.addMethod(
      RestMethod.DELETE,
      props.spacesLambdaIntegration,
      optionsWithAuth
    );
  }
}
