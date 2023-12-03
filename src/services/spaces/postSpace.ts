import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { v4 } from "uuid";
import { validateAsSpaceEntry } from "../shared/validator";

export async function postSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const id = v4();
  const location = JSON.parse(event.body).location;
  const item = { id, location };
  validateAsSpaceEntry(item);
  const table = process.env.TABLE_NAME;
  const result = await ddbClient.send(
    new PutItemCommand({
      TableName: table,
      Item: marshall(item),
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
