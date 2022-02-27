import * as cdk from 'aws-cdk-lib'
import { GithubRepositoryDispatch, GithubWorkflowDispatch } from '../../../lib'
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets'
import { Template } from 'aws-cdk-lib/assertions'

test('GithubRepositoryDispatchTrigger Instance Test', () => {
  const app = new cdk.App()
  const stack = new cdk.Stack(app, 'TestStack')

  // WHEN
  const expected = new GithubRepositoryDispatch(stack, 'TestGithubWorkflowDispatch', {
    repository: 'myRepo',
    client_payload: {
      myInput: 'myValue',
    },
    token: 'myToken',
  })

  // THEN
  const template = Template.fromStack(stack)
  template.hasResourceProperties('AWS::Lambda::Function', {
    Environment: {
      Variables: {
        WEBHOOK_URL: 'https://api.github/com/repos/myRepo/dispatches/',
        WEBHOOK_HEADERS: JSON.stringify({
          Accept: 'application/vnd.github.everest-preview+json',
          Authorization: 'Token myToken',
        }),
        WEBHOOK_PAYLOAD: JSON.stringify({
          client_payload: {
            myInput: 'myValue',
          },
        }),
        WEBHOOK_METHOD: 'POST',
      },
    },
  })
})
