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

const ddbClient = new DynamoDBClient({});

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  try {
    switch (event.httpMethod) {
      case RestMethod.GET:
        return await getSpaces(event, ddbClient);
      case RestMethod.POST:
        return await postSpace(event, ddbClient);
      case RestMethod.PUT:
        return await updateSpace(event, ddbClient);
      case RestMethod.DELETE:
        return await deleteSpace(event, ddbClient);
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
}
