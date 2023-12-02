import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

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
        const unmarshallItem = unmarshall(getItemResponse.Item);
        return {
          statusCode: 200,
          body: JSON.stringify(unmarshallItem),
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
  const unmarshallItems = result.Items.map((item) => unmarshall(item));

  return {
    statusCode: 200,
    body: JSON.stringify(unmarshallItems),
  };
}
