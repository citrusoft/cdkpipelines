import { CfnOutput, Construct, Stage, StageProps } from '@aws-cdk/core';
import { CdkpipelinesDeploymentStack } from './cdkpipelines-deployment-stack';

/**
 * Deployable unit of web service app
 */
export class CdkpipelinesDeployStage extends Stage {
  public readonly urlOutput: CfnOutput;
  
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const service = new CdkpipelinesDeploymentStack(this, 'CscoeConfigRules');
    
    // Expose CdkpipelinesDemoStack's output one level higher
    this.urlOutput = service.urlOutput;
  }
}