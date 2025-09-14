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

## Verificar el Deployment

### 1. Verificar Stack de CloudFormation
```bash
aws cloudformation list-stacks --query 'StackSummaries[?starts_with(StackName, `CDK-Stack`)][StackName,StackStatus]' --output table
```

### 2. Verificar Servicio ECS
```bash
# Ver estado del servicio
aws ecs describe-services --cluster AppCluster --services AppService --query 'services[0].[serviceName,status,runningCount,desiredCount]' --output table

# Listar tareas ejecutándose
aws ecs list-tasks --cluster AppCluster --service-name AppService
```

### 3. Obtener IP Pública del Contenedor
```bash
# Obtener ARN de la tarea
TASK_ARN=$(aws ecs list-tasks --cluster AppCluster --service-name AppService --query 'taskArns[0]' --output text)

# Obtener Network Interface
NETWORK_INTERFACE=$(aws ecs describe-tasks --cluster AppCluster --tasks $TASK_ARN --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' --output text)

# Obtener IP Pública
PUBLIC_IP=$(aws ec2 describe-network-interfaces --network-interface-ids $NETWORK_INTERFACE --query 'NetworkInterfaces[0].Association.PublicIp' --output text)

echo "Tu API está disponible en: http://$PUBLIC_IP:80"
```

### 4. Probar la API
```bash
# Hacer una petición de prueba
curl http://$PUBLIC_IP:80

# Si tu API tiene endpoints específicos, prueba:
curl http://$PUBLIC_IP:80/items
```

### 5. Ver Logs del Contenedor
```bash
aws logs filter-log-events --log-group-name /ecs/AppLogGroup --limit 20
```

## Limpieza y Destroy

Para eliminar todos los recursos creados y evitar costos:

```bash
# Opción 1: Usando CDK
npx cdk destroy --require-approval never

# Opción 2: Usando CloudFormation directamente
aws cloudformation delete-stack --stack-name CDK-Stack-920897

# Verificar que se eliminó
aws cloudformation wait stack-delete-complete --stack-name CDK-Stack-920897
```

**Importante**: La imagen en ECR (`apiprueba:latest`) no se elimina automáticamente. Si deseas eliminarla:
```bash
aws ecr delete-repository --repository-name apiprueba --force
```

## Cumplimiento del Enunciado

✅ **Usar AWS CDK**: Stack implementado en TypeScript  
✅ **Ejecutar contenedor en ECS Fargate**: Task Definition + Service activos  
✅ **Usar imagen ECR**: `077132975197.dkr.ecr.us-east-1.amazonaws.com/apiprueba:latest`  
✅ **Usar LabRole**: `arn:aws:iam::077132975197:role/LabRole` como execution/task role  
✅ **Infraestructura eliminable**: `cdk destroy` elimina todos los recursos creados  

## Estructura del Proyecto

```
├── app.ts                           # CDK App entry point
├── lib/
│   └── infrastructure-stack.ts      # Stack principal con recursos ECS/Fargate
├── package.json                     # Dependencias y scripts
├── tsconfig.json                   # Configuración TypeScript
├── cdk.json                        # Configuración CDK
└── README.md                       # Esta documentación
```

---
**Nota**: README actualizado el 14/09/2025 para reflejar el deployment exitoso. La infraestructura está desplegada y funcional.

## Recursos Desplegados (Estado Actual)

- **Stack CloudFormation**: `CDK-Stack-920897` (CREATE_COMPLETE)
- **ECS Cluster**: `AppCluster` 
- **ECS Service**: `AppService` (ACTIVE, 1/1 tareas ejecutándose)
- **Task Definition**: `AppTask:1` usando imagen `077132975197.dkr.ecr.us-east-1.amazonaws.com/apiprueba:latest`
- **S3 Bucket**: `AppBucket` (nombre auto-generado seguro)
- **DynamoDB Table**: `AppTable`
- **Security Group**: `AppSecurityGroup` (puertos 80, 8080 abiertos)
- **Log Group**: `/ecs/AppLogGroup`

## Comandos para Re-deployment

Si necesitas re-desplegar o modificar:

```bash
# Sintetizar template
npx cdk synth

# Re-desplegar con parámetros
VPC_ID=$(aws ec2 describe-vpcs --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text)
SUBNETS=$(aws ec2 describe-subnets --filters Name=vpc-id,Values=$VPC_ID --query 'Subnets[:2].SubnetId' --output text | tr '\t' ',')

npx cdk deploy --parameters VpcId=$VPC_ID --parameters SubnetIds=$SUBNETS --require-approval never
```

Cómo limpiar

```bash
npx cdk destroy --parameters VpcId=${VPC_ID}
```



