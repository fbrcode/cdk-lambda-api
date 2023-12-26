import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { RestMethod } from "../../types/rest";
import { postSpace } from "./postSpace";
import { getSpaces } from "./getSpaces";
import { updateSpace } from "./updateSpace";
import { deleteSpace } from "./deleteSpace";
import { InvalidJsonError, MissingFieldError } from "../shared/validator";
import { addCorsHeaders } from "../shared/utils";

const ddbClient = new DynamoDBClient({});

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let response: APIGatewayProxyResult;

  try {
    switch (event.httpMethod) {
      case RestMethod.GET:
        response = await getSpaces(event, ddbClient);
        break;
      case RestMethod.POST:
        response = await postSpace(event, ddbClient);
        break;
      case RestMethod.PUT:
        response = await updateSpace(event, ddbClient);
        break;
      case RestMethod.DELETE:
        response = await deleteSpace(event, ddbClient);
        break;
      default:
        return {
          statusCode: 400,
          body: JSON.stringify("Bad Request"),
        };
    }
  } catch (error) {
    if (
      error instanceof MissingFieldError ||
      error instanceof InvalidJsonError
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify(error.message),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }
  addCorsHeaders(response);
  return response;
}
