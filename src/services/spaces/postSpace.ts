import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { validateAsSpaceEntry } from "../shared/validator";
import { getRandomId, parseJSON } from "../shared/utils";
import { SpaceEntry } from "../model/space";

export async function postSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const id = getRandomId();
  const { location, name, photoUrl } = parseJSON(event.body);
  const item: SpaceEntry = { id, location, name, photoUrl };
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
