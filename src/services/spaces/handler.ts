import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { RestMethod } from "../../types/rest";

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let message: string;
  switch (event.httpMethod) {
    case RestMethod.GET:
      message = `Hello ${RestMethod.GET}`;
      break;
    case RestMethod.POST:
      message = `Hello ${RestMethod.POST}`;
      break;
    default:
      return {
        statusCode: 400,
        body: "Bad Request",
      };
  }

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(message),
  };

  return response;
}
