import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { v4 } from "uuid";

export async function postSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const randomId = v4();
  const body = JSON.parse(event.body);
  const item = { id: randomId, location: body.location };
  const table = process.env.TABLE_NAME;
  const marshallItem = marshall(item);
  const result = await ddbClient.send(
    new PutItemCommand({
      TableName: table,
      Item: marshallItem,
    })
  );
  console.log(result);

  return {
    statusCode: 201,
    body: JSON.stringify({
      id: randomId,
    }),
  };
}
