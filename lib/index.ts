import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface AwsGhWorkflowSchedulerProps {
  // Define construct properties here
}

export class AwsGhWorkflowScheduler extends Construct {

  constructor(scope: Construct, id: string, props: AwsGhWorkflowSchedulerProps = {}) {
    super(scope, id);

    // Define construct contents here

    // example resource
    // const queue = new sqs.Queue(this, 'AwsGhWorkflowSchedulerQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
