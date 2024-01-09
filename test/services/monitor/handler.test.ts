import { handler } from "../../../src/services/monitor/handler";

describe("Monitor lambda test suite", () => {
  const fetchSpy = jest.spyOn(global, "fetch");
  fetchSpy.mockImplementation(() => Promise.resolve({} as any));

  afterEach(() => {
    fetchSpy.mockClear();
    // or use -> jest.clearAllMocks();
  });

  test("Requests for records in SnsEvents", async () => {
    // 1.arrange (prepare)
    const message = "Test message";
    // 2.act (execute)
    await handler(
      {
        Records: [
          {
            Sns: {
              Message: message,
            },
          },
        ],
      } as any,
      {} as any
    );
    // 3.assert (verify)
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(expect.any(String), {
      method: "POST",
      body: JSON.stringify({ text: `Issue detected: ${message}` }),
    });
  });

  test("No sns records, no requests", async () => {
    // 1.arrange (prepare)
    // 2.act (execute)
    await handler(
      {
        Records: [],
      } as any,
      {} as any
    );
    // 3.assert (verify)
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
