import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { RestMethod } from "../../types/rest";
import { postSpaces } from "./postSpaces";
import { getSpaces } from "./getSpaces";

const ddbClient = new DynamoDBClient({});

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  try {
    switch (event.httpMethod) {
      case RestMethod.GET:
        return getSpaces(event, ddbClient);
      case RestMethod.POST:
        return postSpaces(event, ddbClient);
      default:
        return {
          statusCode: 400,
          body: "Bad Request",
        };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }
}
