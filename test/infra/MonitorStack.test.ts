import { App } from "aws-cdk-lib";
import { MonitorStack } from "../../src/infra/stacks/MonitorStack";
import { Template } from "aws-cdk-lib/assertions";

describe("CDK test suite", () => {
  let monitorStackTemplate: Template;

  beforeAll(() => {
    // 1.arrange (prepare) - prepare the template
    const testApp = new App({
      outdir: "cdk.out",
    });
    const monitorStack = new MonitorStack(testApp, "MonitorStack");
    monitorStackTemplate = Template.fromStack(monitorStack);
  });

  test("Lambda properties", () => {
    // 2.act (execute) - query for the construct
    // 3.assert (verify) - check construct properties
    monitorStackTemplate.hasResourceProperties("AWS::Lambda::Function", {
      Handler: "index.handler",
      Runtime: "nodejs18.x",
    });
  });

  test("Sns topic properties", () => {
    // 2.act (execute) - query for the construct
    // 3.assert (verify) - check construct properties
    monitorStackTemplate.hasResourceProperties("AWS::SNS::Topic", {
      DisplayName: "AlarmTopic",
      TopicName: "AlarmTopic",
    });
  });
});
