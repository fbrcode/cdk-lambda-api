export enum DynamoDb {
  PutItem = "dynamodb:PutItem",
  Scan = "dynamodb:Scan",
  GetItem = "dynamodb:GetItem",
  UpdateItem = "dynamodb:UpdateItem",
  DeleteItem = "dynamodb:DeleteItem",
  // Query = "dynamodb:Query",
  // BatchWriteItem = "dynamodb:BatchWriteItem",
  // BatchGetItem = "dynamodb:BatchGetItem",
  // ConditionCheckItem = "dynamodb:ConditionCheckItem",
  // CreateTable = "dynamodb:CreateTable",
  // DescribeTable = "dynamodb:DescribeTable",
  // UpdateTable = "dynamodb:UpdateTable",
  // DeleteTable = "dynamodb:DeleteTable",
  // TagResource = "dynamodb:TagResource",
  // UntagResource = "dynamodb:UntagResource",
}

export enum S3 {
  ListAllMyBuckets = "s3:ListAllMyBuckets",
}
