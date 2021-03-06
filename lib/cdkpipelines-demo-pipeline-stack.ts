import { CdkpipelinesDeployStage } from './cdkpipelines-deploy-stage';
// import { CdkpipelinesDemoStage } from './cdkpipelines-demo-stage';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";

/**
 * The stack that defines the application pipeline
 */
export class CdkpipelinesDemoPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();
 
    const pipeline = new CdkPipeline(this, 'Pipeline', {
      // The pipeline name
      pipelineName: 'MyServicePipeline',
      cloudAssemblyArtifact,

      // Where the source can be found
      sourceAction: new codepipeline_actions.GitHubSourceAction({
        actionName: 'GitHub',
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager('citrusoft'),
        owner: 'citrusoft',
        repo: 'cdkpipelines',
        // oauthToken: SecretValue.secretsManager('aws-lz-iam-pipeline/GitHubToken'),
        // owner: 'pgetech',
        // repo: 'cscoe-config-rules',
      }),

       // How it will be built and synthesized
       synthAction: SimpleSynthAction.standardNpmSynth({
         sourceArtifact,
         cloudAssemblyArtifact,
         
         // We need a build step to compile the TypeScript Lambda
         buildCommand: 'npm run build'
       }),
    });

    // This is where we add the application stages
    // pipeline.addApplicationStage(new CdkpipelinesDemoStage(this, 'PreProd', {
    //   env: { account: '241689241215', region: 'us-west-2' }
    // }));
    pipeline.addApplicationStage(new CdkpipelinesDeployStage(this, 'Deploy', {
      env: { account: '241689241215', region: 'us-west-2' }
    }));
  }
}