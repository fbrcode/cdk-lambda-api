import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export async function updateSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const table = process.env.TABLE_NAME;

  if (
    event.queryStringParameters &&
    "id" in event.queryStringParameters &&
    event.body
  ) {
    const parsedBody = JSON.parse(event.body);
    const spaceId = event.queryStringParameters["id"];
    const requestBodyKey = Object.keys(parsedBody)[0];
    const requestBodyValue = parsedBody[requestBodyKey];

    const updateResult = await ddbClient.send(
      new UpdateItemCommand({
        TableName: table,
        Key: {
          id: {
            S: spaceId,
          },
        },
        UpdateExpression: "set #location = :location",
        ExpressionAttributeValues: {
          ":location": {
            S: requestBodyValue,
          },
        },
        ExpressionAttributeNames: {
          "#location": requestBodyKey,
        },
        ReturnValues: "UPDATED_NEW",
      })
    );

    const data = updateResult.Attributes;
    const unmarshallData = unmarshall(data);

    return {
      statusCode: 204,
      body: JSON.stringify(unmarshallData),
    };
  }
  return {
    statusCode: 400,
    body: JSON.stringify("Please provide correct arguments!"),
  };
}
