#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MyInfrastructureStack } from './lib/infrastructure-stack';

const app = new cdk.App();

// Generar nombre único para el stack basado en timestamp
const uniqueStackId = `CDK-Stack-${Date.now().toString().slice(-6)}`;

// Stack con nombre único para evitar conflictos
new MyInfrastructureStack(app, uniqueStackId, {
  // Tags para identificación
  tags: {
    'Project': 'CDK-Demo',
    'Environment': 'AcademyLabs',
    'DeployedAt': new Date().toISOString(),
    'StackId': uniqueStackId
  },
  
  // Descripción del stack con timestamp
  description: `CDK stack for AWS Academy Labs - Deployed ${new Date().toLocaleString()}`,
  
  // Nombre del stack explícito
  stackName: uniqueStackId
});

app.synth();
