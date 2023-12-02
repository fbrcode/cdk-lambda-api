import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { RestMethod } from "../../types/rest";
import { postSpaces } from "./postSpaces";

const ddbClient = new DynamoDBClient({});

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let message: string;

  try {
    switch (event.httpMethod) {
      case RestMethod.GET:
        message = `Hello ${RestMethod.GET}`;
        break;
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

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(message),
  };

  return response;
}
