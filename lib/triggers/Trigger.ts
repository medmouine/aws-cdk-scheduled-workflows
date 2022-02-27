import * as events from 'aws-cdk-lib/aws-events'
import * as cdk from 'aws-cdk-lib'
import {Construct} from 'constructs'
import parse from 'parse-duration'

export type Cron = events.Schedule | events.CronOptions | string
export type Rate = events.Schedule | cdk.Duration | string

export interface BaseTriggerProps {
  at?: Cron
  every?: Rate
}

export interface Trigger extends Construct {
  target: events.IRuleTarget

  at(schedule: Cron): Trigger
  every(rate: Rate): Trigger
  schedule(): Trigger
}

export abstract class Trigger extends Construct implements Trigger {
  public rule: events.Rule[] = []
  abstract getTarget(): events.IRuleTarget

  protected constructor(scope: Construct, id: string, props: BaseTriggerProps) {
    super(scope, id)

    if (!!props.at) {
      this.at(props.at)
    }
    if (!!props.every) {
      this.every(props.every)
    }
  }

  public at(schedule: Cron): Trigger {
    this.rule.push(new events.Rule(this, 'TriggerScheduleRule', {
      schedule: cronToSchedule(schedule),
    }))
    return this
  }
  public every(rate: Rate): Trigger {
    this.rule.push(new events.Rule(this, 'TriggerRateRule', {
      schedule: rateToSchedule(rate),
    }))
    return this
  }

  public schedule(): Trigger {
    this.rule.forEach(r => r.addTarget(this.getTarget()))
    return this
  }
}

const rateToSchedule = (rate: Rate): events.Schedule => {
  if (rate instanceof events.Schedule) {
    return rate
  }
  if (typeof rate === 'string') {
    return events.Schedule.rate(cdk.Duration.millis(parse(rate)))
  }
  return events.Schedule.rate(rate)
}

const cronToSchedule = (cron: Cron): events.Schedule => {
  if (cron instanceof events.Schedule) {
    return cron
  }
  if (typeof cron === 'string') {
    return events.Schedule.expression(cron)
  }
  return events.Schedule.cron(cron)
}
