import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { getSuffixFromStack } from "../Utils";
import { join } from "path";
import { existsSync } from "fs";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";

export class UiDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    const deploymentBucket = new Bucket(this, "uiDeploymentBucket", {
      bucketName: `spaces-ui-${suffix}`,
    });

    const uiFolder = join(__dirname, "..", "..", "..", "spaces-ui", "dist");
    if (!existsSync(uiFolder)) {
      console.warn(`UI folder ${uiFolder} not found, skipping UI deployment`);
      return;
    }

    new BucketDeployment(this, "SpacesUiDeployment", {
      destinationBucket: deploymentBucket,
      sources: [Source.asset(uiFolder)],
    });

    // Allow CloudFront to read from the bucket
    const originIdentity = new OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );
    deploymentBucket.grantRead(originIdentity);

    // Create a CloudFront distribution
    const distribution = new Distribution(this, "SpaceUiDistribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new S3Origin(deploymentBucket, {
          originAccessIdentity: originIdentity,
        }),
      },
    });

    new CfnOutput(this, "SpaceUiUrl", {
      value: distribution.distributionDomainName,
    });
  }
}
