import {Construct} from "constructs";
import {GithubDispatch, GithubDispatchProps} from "./GithubDispatch";

interface GithubWorkflowDispatchProps extends GithubDispatchProps {
  workflow: string;
  inputs?: {[key: string]: string | number | boolean};
}

export class GithubWorkflowDispatch extends GithubDispatch {
  constructor(scope: Construct, id: string, props: GithubWorkflowDispatchProps) {
    const url = `https://api.github.com/repos/${props.repository}/actions/workflows/${props.workflow}/dispatches`;

    super(scope, id, {
      url,
      ...props,
      payload: {
        ...props.payload,
        inputs: props.inputs,
      },
    });
  }
}
