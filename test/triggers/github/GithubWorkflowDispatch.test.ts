import * as cdk from 'aws-cdk-lib'
import { GithubWorkflowDispatch } from '../../../lib'
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets'
import { Template } from 'aws-cdk-lib/assertions'

test('GithubWorkflowDispatchTrigger Instance Test', () => {
  const app = new cdk.App()
  const stack = new cdk.Stack(app, 'TestStack')

  // WHEN
  const expected = new GithubWorkflowDispatch(stack, 'TestGithubWorkflowDispatch', {
    workflow: 'myWorkflow.yml',
    repository: 'myRepo',
    inputs: {
      myInput: 'myValue',
    },
    token: 'myToken',
    ref: 'master',
  })

  // THEN
  const template = Template.fromStack(stack)
  template.hasResourceProperties('AWS::Lambda::Function', {
    Environment: {
      Variables: {
        WEBHOOK_URL: 'https://api.github.com/repos/myRepo/actions/workflows/myWorkflow.yml/dispatches',
        WEBHOOK_HEADERS: JSON.stringify({
          Accept: 'application/vnd.github.everest-preview+json',
          Authorization: 'Token myToken',
        }),
        WEBHOOK_PAYLOAD: JSON.stringify({
          ref: 'master',
          inputs: {
            myInput: 'myValue',
          },
        }),
        WEBHOOK_METHOD: 'POST',
      },
    },
  })
})

test('GithubWorkflowDispatchTrigger Default Ref Test', () => {
  const app = new cdk.App()
  const stack = new cdk.Stack(app, 'TestStack')

  // WHEN
  const expected = new GithubWorkflowDispatch(stack, 'TestGithubWorkflowDispatch', {
    workflow: 'myWorkflow.yml',
    repository: 'myRepo',
    inputs: {
      myInput: 'myValue',
    },
    token: 'myToken',
  })

  // THEN
  const template = Template.fromStack(stack)
  template.hasResourceProperties('AWS::Lambda::Function', {
    Environment: {
      Variables: {
        WEBHOOK_URL: 'https://api.github.com/repos/myRepo/actions/workflows/myWorkflow.yml/dispatches',
        WEBHOOK_HEADERS: JSON.stringify({
          Accept: 'application/vnd.github.everest-preview+json',
          Authorization: 'Token myToken',
        }),
        WEBHOOK_PAYLOAD: JSON.stringify({
          ref: 'ref',
          inputs: {
            myInput: 'myValue',
          },
        }),
        WEBHOOK_METHOD: 'POST',
      },
    },
  })
})
