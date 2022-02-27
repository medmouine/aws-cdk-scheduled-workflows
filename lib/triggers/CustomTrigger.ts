import {BaseTriggerProps, Trigger} from "./Trigger";
import {Construct} from "constructs";
import * as events from "aws-cdk-lib/aws-events";

interface CustomTriggerProps extends BaseTriggerProps {
  target: events.IRuleTarget;
}

export class CustomTrigger extends Trigger {
  constructor(scope: Construct, id: string, props: CustomTriggerProps) {
    super(scope, id, props)
    this.target = props.target;
  }

  // Uses python script for simplicity as it is the only runtime that does not require any dependencies
  // All it does is call the webhook_url with the github_token as a header and the action_type/account_id as the body
  getTarget(): events.IRuleTarget {
    return this.target
  }
}
