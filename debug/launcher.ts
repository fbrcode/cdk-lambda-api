import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../src/services/spaces/handler";
import { RestMethod } from "../src/types/rest";

// old way
// handler({} as any, {} as any);

// handling POST request
// handler(
//   {
//     httpMethod: RestMethod.POST,
//     body: JSON.stringify({ location: "Dublin" }),
//   } as any,
//   {} as any
// );

// handling GET request for all spaces
// handler(
//   {
//     httpMethod: RestMethod.GET,
//   } as any,
//   {} as any
// );

// handling GET request for specific space
handler(
  {
    httpMethod: RestMethod.GET,
    queryStringParameters: { id: "3347b597-8efe-4fbe-8179-2151aa55344f" },
  } as any,
  {} as any
);
