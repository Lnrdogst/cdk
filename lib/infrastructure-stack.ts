import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// No VPC lookups that generate ImportValue; use a CFN parameter for VpcId instead.

// Minimal stack: fixed names, use default VPC, reference existing LabRole only.
export class MyInfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Use the pre-existing LabRole only
    const labRoleArn = `arn:aws:iam::${this.account}:role/LabRole`;

    // CloudFormation parameter for VPC ID (caller should provide the default VPC ID)
    const vpcIdParam = new cdk.CfnParameter(this, 'VpcId', {
      type: 'String',
      description: 'VPC ID where resources will be created (use default VPC id)'
    });
    const vpcId = vpcIdParam.valueAsString;

    // CloudWatch Log Group (fixed name)
    const logGroup = new cdk.aws_logs.CfnLogGroup(this, 'AppLogGroup', {
      logGroupName: '/ecs/AppLogGroup',
      retentionInDays: 3
    });

    // Security Group associated to the default VPC (fixed name)
  const securityGroup = new cdk.aws_ec2.CfnSecurityGroup(this, 'AppSecurityGroup', {
      groupDescription: 'Security group for ECS tasks',
      groupName: 'AppSecurityGroup',
      vpcId: vpcId,
      securityGroupIngress: [
        { ipProtocol: 'tcp', fromPort: 80, toPort: 80, cidrIp: '0.0.0.0/0' },
        { ipProtocol: 'tcp', fromPort: 8080, toPort: 8080, cidrIp: '0.0.0.0/0' }
      ],
      securityGroupEgress: [
        { ipProtocol: '-1', cidrIp: '0.0.0.0/0' }
      ]
    });

    // S3 Bucket: deterministic name built from account/region/stack and sanitized to meet S3 rules
    // Rules enforced: lowercase, only [a-z0-9-], no leading/trailing hyphens, length 3..63
    const rawBucketName = `appbucket-${this.account}-${this.region}-${this.stackName}`;
    // Attempt to sanitize the string. Note: these values may be CDK tokens; toString() will be used
    // during synthesis which produces a token text. We still apply a defensive sanitization to
    // avoid invalid characters and trailing hyphens which CloudFormation would reject.
    let safeBucketName = rawBucketName.toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-') // replace invalid chars with '-'
      .replace(/-+/g, '-')          // collapse consecutive hyphens
      .replace(/^-+|-+$/g, '');     // trim leading/trailing hyphens

    // Ensure the name does not exceed 63 characters and does not end with a hyphen after truncation
    if (safeBucketName.length > 63) {
      safeBucketName = safeBucketName.slice(0, 63).replace(/-+$/g, '');
    }

    // Ensure minimal length (3). If too short, pad with 'a'.
    while (safeBucketName.length < 3) {
      safeBucketName = `${safeBucketName}a`;
    }

    const bucket = new cdk.aws_s3.CfnBucket(this, 'AppBucket', {
      bucketName: safeBucketName,
      publicAccessBlockConfiguration: {
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true
      }
    });

    // DynamoDB Table (fixed name)
    const table = new cdk.aws_dynamodb.CfnTable(this, 'AppTable', {
      tableName: 'AppTable',
      attributeDefinitions: [{ attributeName: 'id', attributeType: 'S' }],
      keySchema: [{ attributeName: 'id', keyType: 'HASH' }],
      billingMode: 'PAY_PER_REQUEST'
    });

    // ECS Cluster (fixed name)
    const cluster = new cdk.aws_ecs.CfnCluster(this, 'AppCluster', {
      clusterName: 'AppCluster'
    });

    // Outputs
    new cdk.CfnOutput(this, 'BucketName', { value: bucket.ref });
    new cdk.CfnOutput(this, 'TableName', { value: table.ref });
    new cdk.CfnOutput(this, 'ClusterName', { value: cluster.ref });
    new cdk.CfnOutput(this, 'LogGroupName', { value: logGroup.ref });
    new cdk.CfnOutput(this, 'SecurityGroupId', { value: securityGroup.ref });
    new cdk.CfnOutput(this, 'LabRoleArn', { value: labRoleArn });
  }
}
