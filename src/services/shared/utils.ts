import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { InvalidJsonError } from "./validator";
import { randomUUID } from "crypto";

export function parseJSON(arg: string): any {
  try {
    return JSON.parse(arg);
  } catch (error) {
    throw new InvalidJsonError(error.message);
  }
}

export function getRandomId(): string {
  return randomUUID();
}

export function hasAdminGroup(event: APIGatewayProxyEvent): boolean {
  const groups = event.requestContext.authorizer?.claims["cognito:groups"];
  if (groups) {
    return groups.includes("Administrators");
  }
  return false;
}

export function addCorsHeaders(arg: APIGatewayProxyResult): void {
  if (!arg.headers) {
    arg.headers = {};
  }
  arg.headers["Access-Control-Allow-Origin"] = "*";
  arg.headers["Access-Control-Allow-Methods"] = "*";
}
