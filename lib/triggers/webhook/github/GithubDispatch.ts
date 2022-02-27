import { Construct } from 'constructs'
import { BaseTriggerProps } from '../../Trigger'
import { HttpWebhookTrigger } from '../HttpWebhookTrigger'

export interface GithubDispatchProps extends BaseTriggerProps {
  repository: string
  token: string
  payload?: any
}

interface AbstractGithubDispatchProps extends GithubDispatchProps {
  url: string
}

export abstract class GithubDispatch extends HttpWebhookTrigger {
  protected constructor(scope: Construct, id: string, props: AbstractGithubDispatchProps) {
    super(scope, id, {
      webhook_url: props.url,
      auth: {
        token: props.token,
      },
      headers: {
        Accept: 'application/vnd.github.everest-preview+json',
      },
      method: 'POST',
      payload: props.payload,
      at: props.at,
    })
  }
}
