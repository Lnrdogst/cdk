# Configuración para AWS Academy Labs - ECS Stack

## Antes de desplegar, actualiza estos valores:

### 1. Imagen ECR
En el archivo `lib/infrastructure-stack.ts`, línea ~50, actualiza:
```typescript
// CAMBIA ESTA URL POR TU IMAGEN ECR
image: `${this.account}.dkr.ecr.${this.region}.amazonaws.com/my-app:latest`,
```

Por tu imagen real, por ejemplo:
```typescript
image: `${this.account}.dkr.ecr.${this.region}.amazonaws.com/mi-aplicacion:v1.0.0`,
```

### 2. Variables de entorno (opcional)
Puedes modificar las variables de entorno en la sección `environment` del container.

### 3. Puertos
Si tu aplicación usa un puerto diferente al 80, actualiza:
- `containerPort` en portMappings
- Variable de entorno `PORT`
- healthCheckPath si es necesario

## Comandos de despliegue:

```bash
# 1. Compilar
npm run build

# 2. Sintetizar (verificar template)
npx cdk synth

# 3. Desplegar
npx cdk deploy --require-approval never
```

## Recursos creados:

✅ **ECS Cluster** - Cluster Fargate para contenedores
✅ **ECS Service** - Servicio que ejecuta tu imagen Docker
✅ **Application Load Balancer** - Balanceador de carga público
✅ **Target Group** - Grupo de destinos para ALB
✅ **Security Group** - Reglas de firewall
✅ **CloudWatch Log Group** - Logs del contenedor
✅ **S3 Bucket** - Para assets adicionales
✅ **DynamoDB Table** - Base de datos NoSQL

## Ventajas de esta implementación:

🚫 **No requiere bootstrap de CDK**
🚫 **No usa buckets de staging**
🚫 **No depende de parámetros SSM**
✅ **Solo recursos CloudFormation nativos (Cfn*)**
✅ **Usa LabRole preexistente**
✅ **Compatible con AWS Academy Labs**

## Post-despliegue:

1. **Obtener URL**: Usa el output `ApplicationURL`
2. **Ver logs**: CloudWatch Logs en `/ecs/my-app`
3. **Actualizar imagen**: Usa el comando del output `UpdateImageCommand`
