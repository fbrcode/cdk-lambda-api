import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../src/services/spaces/handler";
import { RestMethod } from "../src/types/rest";

// old way
// handler({} as any, {} as any);

// handling POST request
// handler(
//   {
//     httpMethod: RestMethod.POST,
//     body: JSON.stringify({ location: "London" }),
//   } as any,
//   {} as any
// );

// handling GET request for all spaces
handler(
  {
    httpMethod: RestMethod.GET,
  } as any,
  {} as any
);

// handling GET request for specific space
// handler(
//   {
//     httpMethod: RestMethod.GET,
//     queryStringParameters: { id: "1dcce616-bbd8-4d1c-bea9-f80bb5d6dd48" },
//   } as any,
//   {} as any
// );
