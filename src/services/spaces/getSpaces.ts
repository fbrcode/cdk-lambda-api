import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";

export async function getSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const table = process.env.TABLE_NAME;

  if (event.queryStringParameters) {
    if ("id" in event.queryStringParameters) {
      const spaceId = event.queryStringParameters["id"];
      const getItemResponse = await ddbClient.send(
        new GetItemCommand({
          TableName: table,
          Key: {
            id: {
              S: spaceId,
            },
          },
        })
      );
      if (getItemResponse.Item) {
        return {
          statusCode: 200,
          body: JSON.stringify(getItemResponse.Item),
        };
      }
      return {
        statusCode: 404,
        body: JSON.stringify(`Space with id ${spaceId} not found!`),
      };
    }
    return {
      statusCode: 400,
      body: JSON.stringify("Parameter id is required!"),
    };
  }

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
