import { Context, SNSEvent } from "aws-lambda";

// const webHookUrl = process.env.WEBHOOK_URL;
const webHookUrl = "https://hooks.slack.com/services/...";

async function handler(event: SNSEvent, context: Context) {
  for (const record of event.Records) {
    const message = record.Sns.Message;
    await fetch(webHookUrl, {
      method: "POST",
      body: JSON.stringify({
        text: `Issue detected: ${message}`,
      }),
    });
  }
}

export { handler };
