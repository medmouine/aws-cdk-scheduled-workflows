import { Construct } from 'constructs'
import { GithubDispatch, GithubDispatchProps } from './GithubDispatch'

interface GithubRepositoryDispatchProps extends GithubDispatchProps {
  event_type?: string
  client_payload?: { [key: string]: any }
}

export class GithubRepositoryDispatch extends GithubDispatch {
  constructor(scope: Construct, id: string, props: GithubRepositoryDispatchProps) {
    const url = `https://api.github/com/repos/${props.repository}/dispatches/`

    super(scope, id, {
      ...props,
      url,
      payload: {
        ...props.payload,
        event_type: props.event_type,
        client_payload: props.client_payload ?? {},
      },
    })
  }
}
