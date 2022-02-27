import * as cdk from 'aws-cdk-lib'
import * as events from 'aws-cdk-lib/aws-events'
import * as targets from 'aws-cdk-lib/aws-events-targets'
import * as Lambda from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'
import * as fs from 'fs'
import * as path from 'path'
import { BaseTriggerProps, Trigger } from '../Trigger'

interface HttpWebhookProps extends BaseTriggerProps {
  webhook_url: string
  method?: string
  headers?: { [key: string]: string | number | boolean }
  payload?: any
  auth?: {
    token?: string
    bearer?: string
  }
}

export class HttpWebhookTrigger extends Trigger {
  public fn: Lambda.Function

  constructor(scope: Construct, id: string, props: HttpWebhookProps) {
    super(scope, id, props)
    // Uses python script for simplicity as it is the only runtime that does not require any dependencies
    // All it does is call the webhook_url with the github_token as a header and the action_type/account_id as the body
    const WEBHOOK_SCRIPT_FILE = path.resolve(__dirname, 'http_webhook.py')
    this.fn = new Lambda.Function(this, 'WebhookFunction', {
      code: new Lambda.InlineCode(fs.readFileSync(WEBHOOK_SCRIPT_FILE, { encoding: 'utf-8' })),
      handler: 'index.main',
      runtime: Lambda.Runtime.PYTHON_3_6,
      timeout: cdk.Duration.seconds(300),
      environment: {
        WEBHOOK_URL: props.webhook_url,
        WEBHOOK_HEADERS: JSON.stringify({ ...props.headers, ...getAuthHeader(props.auth) }),
        WEBHOOK_PAYLOAD: JSON.stringify(props.payload),
        WEBHOOK_METHOD: props.method || 'POST',
      },
    })
  }

  getTarget(): events.IRuleTarget[] {
    return [new targets.LambdaFunction(this.fn)]
  }
}

const getAuthHeader = (auth: { token?: string; bearer?: string } | undefined): { Authorization: string } | {} => {
  if (!auth) {
    return {}
  }
  if (auth.token && auth.bearer) {
    throw new Error('Only one of token or bearer can be specified')
  }
  if (auth.token) {
    return {
      Authorization: `Token ${auth.token}`,
    }
  }
  if (auth.bearer) {
    return {
      Authorization: `Bearer ${auth.bearer}`,
    }
  }
  return {}
}
