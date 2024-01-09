import { App } from "aws-cdk-lib";
import { MonitorStack } from "../../src/infra/stacks/MonitorStack";
import { Capture, Match, Template } from "aws-cdk-lib/assertions";

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

  test("Sns subscription properties - with matchers", () => {
    // 2.act (execute) - query for the construct
    // 3.assert (verify) - check construct properties
    monitorStackTemplate.hasResourceProperties(
      "AWS::SNS::Subscription",
      Match.objectEquals({
        Protocol: "lambda",
        TopicArn: {
          Ref: Match.stringLikeRegexp("AlarmTopic*"),
        },
        Endpoint: {
          "Fn::GetAtt": [Match.stringLikeRegexp("webHookLambda*"), "Arn"],
        },
      })
    );
  });

  test("Sns subscription properties - with exact values", () => {
    // 2.act (execute) - query for the construct
    // 3.assert (verify) - check construct properties

    const snsTopic = monitorStackTemplate.findResources("AWS::SNS::Topic");
    const snsTopicName = Object.keys(snsTopic)[0];

    const lambda = monitorStackTemplate.findResources("AWS::Lambda::Function");
    const lambdaName = Object.keys(lambda)[0];

    monitorStackTemplate.hasResourceProperties("AWS::SNS::Subscription", {
      Protocol: "lambda",
      TopicArn: {
        Ref: snsTopicName,
      },
      Endpoint: {
        "Fn::GetAtt": [lambdaName, "Arn"],
      },
    });
  });

  test("Alarm actions - using capture", () => {
    // 2.act (execute) - query for the construct
    // 3.assert (verify) - check construct properties

    const alarmActionCapture = new Capture();
    monitorStackTemplate.hasResourceProperties("AWS::CloudWatch::Alarm", {
      AlarmActions: alarmActionCapture,
    });

    expect(alarmActionCapture.asArray()).toEqual([
      { Ref: expect.stringMatching(/^AlarmTopic/) },
    ]);
  });

  /* quick and cheap and test against templates */

  // run once to generate a snapshot of the template under __snapshots__ folder => (*.snap)
  test("Monitor stack - snapshot", () => {
    expect(monitorStackTemplate.toJSON()).toMatchSnapshot();
  });

  // smaller snapshot for a given stack resource (i.e. Lambda)
  test("Monitor stack :: Lambda - snapshot", () => {
    const lambda = monitorStackTemplate.findResources("AWS::Lambda::Function");
    expect(lambda).toMatchSnapshot();
  });

  // smaller snapshot for a given stack resource (i.e. SNS topic)
  test("Monitor stack :: SNS topic - snapshot", () => {
    const snsTopic = monitorStackTemplate.findResources("AWS::SNS::Topic");
    expect(snsTopic).toMatchSnapshot();
  });

  /* */
});
