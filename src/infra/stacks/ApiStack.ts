import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { RestMethod } from "../../types/rest";

interface ApiStackProps extends StackProps {
  spacesLambdaIntegration: LambdaIntegration;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "SpacesApi");
    const spacesResource = api.root.addResource("spaces");
    spacesResource.addMethod(RestMethod.GET, props.spacesLambdaIntegration);
    spacesResource.addMethod(RestMethod.POST, props.spacesLambdaIntegration);
    spacesResource.addMethod(RestMethod.PUT, props.spacesLambdaIntegration);
  }
}
