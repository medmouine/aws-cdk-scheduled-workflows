import {Construct} from 'constructs';
import {Trigger} from "./triggers/Trigger";

export interface SchedulerProps {
  triggers: Trigger[];
}

export class Scheduler extends Construct {
  public readonly triggers: Trigger[];

  constructor(scope: Construct, id: string, props: SchedulerProps) {
    super(scope, id);
    this.triggers = props.triggers.map(trigger => trigger.schedule());
  }
}

export * from "./triggers";
