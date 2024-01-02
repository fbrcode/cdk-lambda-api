import { SNSEvent } from "aws-lambda";
import { handler } from "../../src/services/monitor/handler";

const snsEvent: SNSEvent = {
  Records: [
    {
      Sns: {
        Message: "test message",
      },
    },
  ],
} as any;

handler(snsEvent, {} as any);
