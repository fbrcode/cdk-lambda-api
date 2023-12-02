import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../src/services/spaces/handler";
import { RestMethod } from "../src/types/rest";

// old way
// handler({} as any, {} as any);

// handling POST request
handler(
  {
    httpMethod: RestMethod.POST,
    body: JSON.stringify({ location: "Dublin" }),
  } as APIGatewayProxyEvent,
  {} as any
);

// handling GET request
handler(
  {
    httpMethod: RestMethod.GET,
  } as APIGatewayProxyEvent,
  {} as any
);
