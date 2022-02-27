import * as events from 'aws-cdk-lib/aws-events'
import { Construct } from 'constructs'
import { BaseTriggerProps, Trigger } from './Trigger'

interface CustomTriggerProps extends BaseTriggerProps {
  getTarget: (scope: Construct) => events.IRuleTarget[]
}

export class CustomTrigger extends Trigger {
  constructor(scope: Construct, id: string, props: CustomTriggerProps) {
    super(scope, id, props)
    this.targets = props.getTarget(this)
  }

  // Uses python script for simplicity as it is the only runtime that does not require any dependencies
  // All it does is call the webhook_url with the github_token as a header and the action_type/account_id as the body
  getTarget(): events.IRuleTarget[] | undefined {
    return this.targets
  }
}
