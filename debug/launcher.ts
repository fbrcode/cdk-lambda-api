import { handler } from "../src/services/spaces/handler";
import { RestMethod } from "../src/types/rest";

// setting environment variables
process.env.AWS_PROFILE = "cdk";
process.env.TABLE_NAME = "SpacesTable-027b1e494763";

// old way
// handler({} as any, {} as any);

// handling POST request
handler(
  {
    httpMethod: RestMethod.POST,
    body: JSON.stringify({ location: "London" }),
  } as any,
  {} as any
).then((res) => console.log(res));

// handling GET request for all spaces
// handler(
//   {
//     httpMethod: RestMethod.GET,
//   } as any,
//   {} as any
// ).then((res) => console.log(res));

// handling GET request for specific space
// handler(
//   {
//     httpMethod: RestMethod.GET,
//     queryStringParameters: { id: "1dcce616-bbd8-4d1c-bea9-f80bb5d6dd48" },
//   } as any,
//   {} as any
// ).then((res) => console.log(res));

// handling PUT request for specific space (update)
// handler(
//   {
//     httpMethod: RestMethod.PUT,
//     queryStringParameters: { id: "1dcce616-bbd8-4d1c-bea9-f80bb5d6dd48" },
//     body: JSON.stringify({ location: "UK" }),
//   } as any,
//   {} as any
// ).then((res) => console.log(res));

// handling DELETE request for specific space
// handler(
//   {
//     httpMethod: RestMethod.DELETE,
//     queryStringParameters: { id: "1dcce616-bbd8-4d1c-bea9-f80bb5d6dd48" },
//   } as any,
//   {} as any
// ).then((res) => console.log(res));
