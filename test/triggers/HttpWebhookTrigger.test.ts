import * as cdk from 'aws-cdk-lib'
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets'
import { Template } from 'aws-cdk-lib/assertions'
import { HttpWebhookTrigger } from '../../lib'

const headers = {
  strHeader: 'test',
  intHeader: 1,
  boolHeader: true,
}

const body = {
  strPayload: 'Hello World',
  intPayload: 1,
  boolPayload: true,
}

test('HttpWebhookTrigger Token Webhook Test', () => {
  const app = new cdk.App()
  const stack = new cdk.Stack(app, 'TestStack')

  // WHEN
  const expected = new HttpWebhookTrigger(stack, 'TestHttpWebhookTrigger', {
    headers,
    method: 'GET',
    payload: body,
    webhook_url: 'test.com',
    auth: {
      token: 'test',
    },
  })

  // THEN
  const template = Template.fromStack(stack)
  template.hasResourceProperties('AWS::Lambda::Function', {
    Environment: {
      Variables: {
        WEBHOOK_URL: 'test.com',
        WEBHOOK_HEADERS: JSON.stringify({
          ...headers,
          Authorization: 'Token test',
        }),
        WEBHOOK_PAYLOAD: JSON.stringify(body),
        WEBHOOK_METHOD: 'GET',
      },
    },
  })
})

test('HttpWebhookTrigger Bearer Webhook Test', () => {
  const app = new cdk.App()
  const stack = new cdk.Stack(app, 'TestStack')

  // WHEN
  const expected = new HttpWebhookTrigger(stack, 'TestHttpWebhookTrigger', {
    headers,
    method: 'GET',
    payload: body,
    webhook_url: 'test.com',
    auth: {
      bearer: 'test',
    },
  })

  // THEN
  const template = Template.fromStack(stack)
  template.hasResourceProperties('AWS::Lambda::Function', {
    Environment: {
      Variables: {
        WEBHOOK_URL: 'test.com',
        WEBHOOK_HEADERS: JSON.stringify({
          ...headers,
          Authorization: 'Bearer test',
        }),
        WEBHOOK_PAYLOAD: JSON.stringify(body),
        WEBHOOK_METHOD: 'GET',
      },
    },
  })
})

test('HttpWebhookTrigger Public Webhook Test', () => {
  const app = new cdk.App()
  const stack = new cdk.Stack(app, 'TestStack')

  // WHEN
  const expected = new HttpWebhookTrigger(stack, 'TestHttpWebhookTrigger', {
    headers,
    method: 'GET',
    payload: body,
    webhook_url: 'test.com',
  })

  // THEN
  const template = Template.fromStack(stack)
  template.hasResourceProperties('AWS::Lambda::Function', {
    Environment: {
      Variables: {
        WEBHOOK_URL: 'test.com',
        WEBHOOK_HEADERS: JSON.stringify(headers),
        WEBHOOK_PAYLOAD: JSON.stringify(body),
        WEBHOOK_METHOD: 'GET',
      },
    },
  })
})

test('HttpWebhookTrigger Default Method Test', () => {
  const app = new cdk.App()
  const stack = new cdk.Stack(app, 'TestStack')

  // WHEN
  const expected = new HttpWebhookTrigger(stack, 'TestHttpWebhookTrigger', {
    headers,
    payload: body,
    webhook_url: 'test.com',
  })

  // THEN
  const template = Template.fromStack(stack)
  template.hasResourceProperties('AWS::Lambda::Function', {
    Environment: {
      Variables: {
        WEBHOOK_URL: 'test.com',
        WEBHOOK_HEADERS: JSON.stringify(headers),
        WEBHOOK_PAYLOAD: JSON.stringify(body),
        WEBHOOK_METHOD: 'POST',
      },
    },
  })
})

test('HttpWebhookTrigger Bearer And Token Specified Exception Test', () => {
  const app = new cdk.App()
  const stack = new cdk.Stack(app, 'TestStack')

  // WHEN
  expect(
    () =>
      new HttpWebhookTrigger(stack, 'TestHttpWebhookTrigger', {
        headers,
        payload: body,
        webhook_url: 'test.com',
        auth: {
          token: 'test',
          bearer: 'test',
        },
      })
  ).toThrow(/Only one of token or bearer can be specified/)
})
