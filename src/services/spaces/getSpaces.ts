import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

export async function getSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const table = process.env.TABLE_NAME;
  const result = await ddbClient.send(
    new ScanCommand({
      TableName: table,
    })
  );
  console.log(result.Items);

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  };
}
