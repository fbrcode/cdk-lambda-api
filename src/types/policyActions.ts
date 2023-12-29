export enum DynamoDb {
  PutItem = "dynamodb:PutItem",
  Scan = "dynamodb:Scan",
  GetItem = "dynamodb:GetItem",
  UpdateItem = "dynamodb:UpdateItem",
  DeleteItem = "dynamodb:DeleteItem",
  // Query = "dynamodb:Query",
  // BatchWriteItem = "dynamodb:BatchWriteItem",
  // BatchGetItem = "dynamodb:BatchGetItem",
}

export enum S3 {
  ListAllMyBuckets = "s3:ListAllMyBuckets",
  PutObject = "s3:PutObject",
  PutObjectAcl = "s3:PutObjectAcl",
}
