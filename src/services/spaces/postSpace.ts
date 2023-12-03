import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { validateAsSpaceEntry } from "../shared/validator";
import { getRandomId, parseJSON } from "../shared/utils";

export async function postSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const id = getRandomId();
  const { location, name } = parseJSON(event.body);
  const item = { id, location, name };
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
