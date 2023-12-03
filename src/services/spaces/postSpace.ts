import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { v4 } from "uuid";

export async function postSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify("Message body is required!"),
    };
  }
  const location = JSON.parse(event.body).location;
  if (!location) {
    return {
      statusCode: 400,
      body: JSON.stringify("Location is required!"),
    };
  }

  const id = v4();
  const item = { id, location };
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
      id,
    }),
  };
}
