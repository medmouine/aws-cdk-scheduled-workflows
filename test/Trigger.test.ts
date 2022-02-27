import * as cdk from 'aws-cdk-lib'
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets'
import { Function, InlineCode, Runtime } from 'aws-cdk-lib/aws-lambda'
import { Match, Template } from 'aws-cdk-lib/assertions'
import { CustomTrigger } from '../lib/triggers/CustomTrigger'
import { aws_events } from 'aws-cdk-lib'
import { Construct } from 'constructs'

const inlineCode = `
      export async function handler() {
        return {
          success: true,
          result: event.context,
        };
      }
    `

let fn: Function
const getTarget = (scope: Construct) => {
  fn = new Function(scope, 'fn', {
    functionName: 'myFunction',
    code: new InlineCode(inlineCode),
    handler: 'handler',
    runtime: Runtime.NODEJS_10_X,
  })
  return [new LambdaFunction(fn)]
}

test('Trigger at Prop Test', () => {
  const app = new cdk.App()
  const stack = new cdk.Stack(app, 'TestStack')
  const fn = new Function(stack, 'TestFunction', {
    handler: 'index.handler',
    code: new InlineCode(inlineCode),
    runtime: Runtime.NODEJS_12_X,
  })

  // WHEN
  const expected = new CustomTrigger(stack, 'TestCustomTrigger', {
    getTarget,
    at: '2022-01-01',
  })

  // THEN
  expect(expected.rules.length).toBe(1)

  const template = Template.fromStack(stack)
  template.hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: '2022-01-01',
    State: 'ENABLED',
  })
})

test('Trigger every Prop Test', () => {
  const app = new cdk.App()
  const stack = new cdk.Stack(app, 'TestStack')
  const fn = new Function(stack, 'TestFunction', {
    handler: 'index.handler',
    code: new InlineCode(inlineCode),
    runtime: Runtime.NODEJS_12_X,
  })

  // WHEN
  const expected = new CustomTrigger(stack, 'TestCustomTrigger', {
    getTarget,
    every: cdk.Duration.minutes(15),
  })

  // THEN
  expect(expected.rules.length).toBe(1)

  const template = Template.fromStack(stack)
  template.hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(15 minutes)',
    State: 'ENABLED',
  })
})

test('Trigger at Method Test', () => {
  const app = new cdk.App()
  const stack = new cdk.Stack(app, 'TestStack')
  const fn = new Function(stack, 'TestFunction', {
    handler: 'index.handler',
    code: new InlineCode(inlineCode),
    runtime: Runtime.NODEJS_12_X,
  })

  // WHEN
  const expected = new CustomTrigger(stack, 'TestCustomTrigger', {
    getTarget,
  })

  expect(expected.rules.length).toBe(0)

  expected
    .at('2022-01-01')
    .at({
      minute: '0',
      hour: '0',
      month: '1',
      weekDay: 'SUN',
    })
    .at(aws_events.Schedule.expression('cron(0 0 1 1 * ? *)'))

  expect(expected.rules.length).toBe(3)

  const template = Template.fromStack(stack)
  template.hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: '2022-01-01',
    State: 'ENABLED',
  })
  template.hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'cron(0 0 ? 1 SUN *)',
    State: 'ENABLED',
  })
  template.hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'cron(0 0 1 1 * ? *)',
    State: 'ENABLED',
  })
})

test('Trigger every Method Test', () => {
  const app = new cdk.App()
  const stack = new cdk.Stack(app, 'TestStack')
  const fn = new Function(stack, 'TestFunction', {
    handler: 'index.handler',
    code: new InlineCode(inlineCode),
    runtime: Runtime.NODEJS_12_X,
  })

  // WHEN
  const expected = new CustomTrigger(stack, 'TestCustomTrigger', {
    getTarget,
  })

  expect(expected.rules.length).toBe(0)

  expected
    .every('rate(15 minutes)')
    .every('1h')
    .every(aws_events.Schedule.rate(cdk.Duration.days(1)))

  expect(expected.rules.length).toBe(3)

  const template = Template.fromStack(stack)
  template.hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(15 minutes)',
    State: 'ENABLED',
  })
  template.hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 day)',
    State: 'ENABLED',
  })
  template.hasResourceProperties('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 hour)',
    State: 'ENABLED',
  })
})

test('Trigger Schedule Method Test', () => {
  const app = new cdk.App()
  const stack = new cdk.Stack(app, 'TestStack')

  // WHEN
  const trigger = new CustomTrigger(stack, 'TestCustomTrigger', {
    getTarget,
  })
    .every('15min')
    .at('2022-01-01')

  trigger.schedule()
  const template = Template.fromStack(stack)

  const fns = template.findResources('AWS::Lambda::Function', {
    Properties: {
      FunctionName: Match.exact('myFunction'),
    },
  })
  const fnArn = Object.keys(fns)[0]
  template.hasResourceProperties('AWS::Events::Rule', {
    Targets: Match.arrayEquals([
      {
        Id: Match.anyValue(),
        Arn: {
          'Fn::GetAtt': Match.arrayWith([fnArn]),
        },
      },
    ]),
  })
})
