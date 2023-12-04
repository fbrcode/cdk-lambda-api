import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { parseJSON } from "../shared/utils";

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
    const parsedBody = parseJSON(event.body);
    const spaceId = event.queryStringParameters["id"];

    let updateExpression = "set ";
    let expressionNames = {};
    let expressionValues = {};

    const payload = Object.keys(parsedBody);

    const locationKey = payload.filter((key) => key === "location")[0];
    const locationValue = parsedBody[locationKey];
    const hasLocation = locationKey && locationValue;
    if (hasLocation) {
      updateExpression += " #location = :location,";
      expressionNames = {
        ...expressionNames,
        "#location": locationKey,
      };
      expressionValues = {
        ...expressionValues,
        ":location": { S: locationValue },
      };
    }

    const nameKey = payload.filter((key) => key === "name")[0];
    const nameValue = parsedBody[nameKey];
    const hasName = nameKey && nameValue;
    if (hasName) {
      updateExpression += " #name = :name,";
      expressionNames = {
        ...expressionNames,
        "#name": nameKey,
      };
      expressionValues = {
        ...expressionValues,
        ":name": { S: nameValue },
      };
    }

    if (!hasLocation && !hasName) {
      return {
        statusCode: 400,
        body: JSON.stringify("Please provide correct arguments to update!"),
      };
    }

    const updateResult = await ddbClient.send(
      new UpdateItemCommand({
        TableName: table,
        Key: {
          id: {
            S: spaceId,
          },
        },
        UpdateExpression: updateExpression.slice(0, -1),
        ExpressionAttributeNames: expressionNames,
        ExpressionAttributeValues: expressionValues,
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
