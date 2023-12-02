import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { v4 } from "uuid";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

// const s3Client = new S3Client({ region: "us-east-1" });
const s3Client = new S3Client({});

export async function handler(event: APIGatewayProxyEvent, context: Context) {
  console.log(event);

  const command = new ListBucketsCommand({});
  const listBucketsResult = (await s3Client.send(command)).Buckets;

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, I will read from ${
        process.env.TABLE_NAME
      } with id ${v4()} and here are the buckets list: ${JSON.stringify(
        listBucketsResult
      )}`,
    }),
  };

  return response;
}
