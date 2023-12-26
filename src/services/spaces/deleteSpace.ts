import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { hasAdminGroup } from "../shared/utils";

export async function deleteSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const table = process.env.TABLE_NAME;
  if (!hasAdminGroup(event)) {
    return {
      statusCode: 401,
      body: JSON.stringify("Unauthorized!"),
    };
  }

  if (event.queryStringParameters && "id" in event.queryStringParameters) {
    const spaceId = event.queryStringParameters["id"];

    await ddbClient.send(
      new DeleteItemCommand({
        TableName: table,
        Key: {
          id: {
            S: spaceId,
          },
        },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(`Deleted space with id ${spaceId}`),
    };
  }
  return {
    statusCode: 400,
    body: JSON.stringify("Please provide correct id argument!"),
  };
}
