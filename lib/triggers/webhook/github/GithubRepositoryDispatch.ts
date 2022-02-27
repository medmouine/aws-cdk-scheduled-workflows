import {Construct} from "constructs";
import {HttpWebhookTrigger} from "../HttpWebhookTrigger";
import {GithubDispatchProps} from "./GithubDispatch";

interface GithubRepositoryDispatchProps extends GithubDispatchProps {
  event_type?: string;
  client_payload?: { [key: string]: any };
}

export class GithubRepositoryDispatch extends HttpWebhookTrigger {
  constructor(scope: Construct, id: string, props: GithubRepositoryDispatchProps) {
    const url = `https://api.github/com/repos/${props.repository}/dispatches/`;

    super(scope, id, {
      webhook_url: url,
      ...props,
      payload: {
        ...props.payload,
        event_type: props.event_type,
        client_payload: props.client_payload,
      },
    });
  }
}
