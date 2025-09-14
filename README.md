# AWS CDK Infrastructure as Code Project

Este proyecto implementa una infraestructura completa usando AWS CDK (Cloud Development Kit) con TypeScript.

## Arquitectura

El proyecto incluye los siguientes recursos de AWS:

- **S3 Bucket**: Para almacenamiento de archivos
- **DynamoDB Table**: Base de datos NoSQL para almacenar datos de la aplicación
- **Lambda Function**: Función serverless para lógica de negocio
- **API Gateway**: API REST para exponer endpoints HTTP
- **IAM Roles**: Roles y políticas de seguridad apropiadas

## Estructura del Proyecto

```
├── app.ts                    # Aplicación principal CDK
├── lib/
│   └── infrastructure-stack.ts  # Definición del stack
├── package.json              # Dependencias y scripts
├── tsconfig.json            # Configuración TypeScript
├── cdk.json                 # Configuración CDK
└── README.md               # Este archivo
```

## Prerequisitos

- Node.js 18+ instalado
# AWS CDK - Infraestructura ECS Fargate (TypeScript)

Este repositorio contiene un stack AWS CDK que despliega una aplicación containerizada en **ECS Fargate** usando una imagen de **Amazon ECR**. Diseñado para ejecutarse en entornos AWS Academy Labs usando únicamente el LabRole existente.

## ✅ Stack Desplegado y Funcional

La infraestructura actual incluye:
- **S3 Bucket** (`AppBucket`) para almacenamiento
- **DynamoDB Table** (`AppTable`) para datos de la aplicación  
- **ECS Cluster** (`AppCluster`) ejecutando en Fargate
- **ECS TaskDefinition** (`AppTask`) con la imagen ECR `077132975197.dkr.ecr.us-east-1.amazonaws.com/apiprueba:latest`
- **ECS Service** (`AppService`) con 1 instancia ejecutándose
- **Security Group** (`AppSecurityGroup`) con puertos 80 y 8080 abiertos
- **CloudWatch Log Group** (`/ecs/AppLogGroup`) para logs del contenedor
- Usa únicamente `arn:aws:iam::077132975197:role/LabRole` (sin crear nuevos roles)

Estructura relevante

```
├── app.ts
├── lib/
│   └── infrastructure-stack.ts   # Stack principal (Cfn* resources)
├── package.json
├── tsconfig.json
├── cdk.json
└── README.md
```

Punto importante sobre VPC y permisos
- El stack espera recibir el `VpcId` como parámetro CloudFormation (parámetro `VpcId`). Esto evita depender de imports/exports o lookup que puedan fallar en entornos restringidos.
- El despliegue usa el role existente `LabRole` (no se crean nuevos roles ni se requiere bootstrap de CDK en el entorno objetivo salvo que el CLI local lo pida).

Requisitos
- Node.js 18+ (o una versión compatible con las dependencias del proyecto)
- AWS CLI configurado con credenciales que permitan crear recursos en la cuenta/region objetivo

Instalación

```bash
npm install
```

Compilar / Sintetizar

```bash
npx tsc --noEmit      # opcional: chequeo TS
npx cdk synth         # genera plantilla CloudFormation en cdk.out/
```

Despliegue (ejemplo)

1) Obtener el VPC ID por defecto (si aplica):

```bash
VPC_ID=$(aws ec2 describe-vpcs --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text)
```

2) Desplegar pasando el parámetro `VpcId`:

```bash
npx cdk deploy --parameters VpcId=${VPC_ID} --require-approval never
```

Notas y recomendaciones
- Si ya existe una pila en estado `ROLLBACK_COMPLETE`, bórrala con `npx cdk destroy` o desde la consola antes de reintentar.
- El nombre del bucket es determinista y saneado en tiempo de síntesis para evitar errores CloudFormation por nombres inválidos o terminaciones con `-` o `.`.
- No modifiques el código si tu intención es reproducir exactamente este comportamiento; cualquier cambio en `lib/infrastructure-stack.ts` puede cambiar nombres y dependencias.

Outputs esperados
- `BucketName` — nombre del bucket creado
- `TableName` — nombre de la tabla DynamoDB
- `ClusterName` — nombre del cluster ECS
- `LogGroupName` — nombre del LogGroup
- `SecurityGroupId` — id del security group creado

Cómo limpiar

```bash
npx cdk destroy --parameters VpcId=${VPC_ID}
```



