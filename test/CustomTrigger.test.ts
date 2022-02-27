import * as cdk from 'aws-cdk-lib'
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets'
import { Function, InlineCode, Runtime } from 'aws-cdk-lib/aws-lambda'
import { Template } from 'aws-cdk-lib/assertions'
import { CustomTrigger } from '../lib/triggers/CustomTrigger'

const inlineCode = `
      export async function handler() {
        return {
          success: true,
          result: event.context,
        };
      }
    `

test('CustomTrigger Test', () => {
  const app = new cdk.App()
  const stack = new cdk.Stack(app, 'TestStack')
  // WHEN
  const expected = new CustomTrigger(stack, 'TestCustomTrigger', {
    getTarget: (scope) => [
      new LambdaFunction(
        new Function(scope, 'TestFunction', {
          handler: 'index.handler',
          code: new InlineCode(inlineCode),
          runtime: Runtime.NODEJS_12_X,
        })
      ),
    ],
  })

  // THEN
  const template = Template.fromStack(stack)
  template.hasResourceProperties('AWS::Lambda::Function', {
    Code: {
      ZipFile: inlineCode,
    },
  })
})
