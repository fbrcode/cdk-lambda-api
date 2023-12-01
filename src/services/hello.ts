import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { v4 } from "uuid";

export async function handler(event: APIGatewayProxyEvent, context: Context) {
  console.log(event);
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, I will read from ${
        process.env.TABLE_NAME
      } with id ${v4()}`,
    }),
  };

  return response;
}
