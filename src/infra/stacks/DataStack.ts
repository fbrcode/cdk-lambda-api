import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import {
  Table as DynamoTable,
  AttributeType,
  ITable,
} from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { getSuffixFromStack } from "../Utils";
import { Bucket, HttpMethods, IBucket } from "aws-cdk-lib/aws-s3";

export class DataStack extends Stack {
  public readonly spacesTable: ITable;
  public readonly photosBucket: IBucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    this.spacesTable = new DynamoTable(this, "SpacesTable", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: `SpacesTable-${suffix}`,
    });

    this.photosBucket = new Bucket(this, "SpaceUiPhotos", {
      bucketName: `space-ui-photos-${suffix}`,
      // accessControl: BucketAccessControl.PUBLIC_READ, // Not working right now
      // accessControl: BucketAccessControl.PUBLIC_READ_WRITE,
      // publicReadAccess: true,
      // objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
      // autoDeleteObjects: true,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      cors: [
        {
          allowedMethods: [HttpMethods.HEAD, HttpMethods.GET, HttpMethods.PUT],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
    });

    new CfnOutput(this, "SpaceUiPhotosBucketName", {
      value: this.photosBucket.bucketName,
    });
  }
}
