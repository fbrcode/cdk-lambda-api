import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { getSpaces } from "../../../src/services/spaces/getSpaces";

const someItems = {
  Items: [
    {
      id: {
        S: "123",
      },
      location: {
        S: "Paris",
      },
    },
  ],
};

const someItem = {
  Item: {
    id: {
      S: "123",
    },
    location: {
      S: "Paris",
    },
  },
};

describe("GetSpaces test suite", () => {
  const ddbClientMock = {
    send: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Return spaces if no queryStringParameters", async () => {
    const response = [{ id: "123", location: "Paris" }];
    ddbClientMock.send.mockResolvedValueOnce(someItems);
    const getResult = await getSpaces({} as any, ddbClientMock as any);
    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(response),
    };
    expect(getResult).toEqual(expectedResult);
  });

  test("Return 400 if no id in queryStringParameters", async () => {
    const input = { queryStringParameters: { notId: "123" } };
    const getResult = await getSpaces(input as any, ddbClientMock as any);
    const expectedResult = {
      statusCode: 400,
      body: JSON.stringify("Parameter id is required!"),
    };
    expect(getResult).toEqual(expectedResult);
  });

  test("Return 404 if no id in queryStringParameters", async () => {
    ddbClientMock.send.mockResolvedValueOnce({});
    const input = { queryStringParameters: { id: "123" } };
    const getResult = await getSpaces(input as any, ddbClientMock as any);
    const expectedResult = {
      statusCode: 404,
      body: JSON.stringify(`Space with id 123 not found!`),
    };
    expect(getResult).toEqual(expectedResult);
  });

  test("Return 200 if queryStringParameters with found id", async () => {
    ddbClientMock.send.mockResolvedValueOnce(someItem);
    const input = { queryStringParameters: { id: "123" } };
    const response = { id: "123", location: "Paris" };
    const getResult = await getSpaces(input as any, ddbClientMock as any);
    await new Promise(process.nextTick);
    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(response),
    };
    expect(getResult).toEqual(expectedResult);
    expect(ddbClientMock.send).toHaveBeenCalledWith(expect.any(GetItemCommand));
    const getItemCommandInput = (
      ddbClientMock.send.mock.calls[0][0] as GetItemCommand
    ).input;
    const itemResult = { id: { S: "123" } };
    expect(getItemCommandInput.TableName).toBeUndefined();
    expect(getItemCommandInput.Key).toEqual(itemResult);
  });
});
