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
- AWS CLI configurado con credenciales válidas
- TypeScript instalado globalmente (opcional)

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Compilar el proyecto:
```bash
npm run build
```

## Comandos Disponibles

- `npm run build` - Compila el código TypeScript
- `npm run watch` - Compila en modo watch
- `npm run test` - Ejecuta las pruebas
- `npm run cdk` - Ejecuta comandos CDK
- `npm run deploy` - Despliega la infraestructura
- `npm run destroy` - Destruye la infraestructura
- `npm run synth` - Sintetiza el template CloudFormation
- `npm run diff` - Muestra diferencias con el stack desplegado

## Despliegue

1. Configurar las credenciales de AWS:
```bash
aws configure
```

2. Bootstrap CDK (solo la primera vez):
```bash
npx cdk bootstrap
```

3. Desplegar el stack:
```bash
npm run deploy
```

## Recursos Creados

Después del despliegue, el stack creará:

1. **S3 Bucket** con versionado habilitado y cifrado
2. **DynamoDB Table** con facturación bajo demanda
3. **Lambda Function** con código de ejemplo
4. **API Gateway** con endpoints REST
5. **IAM Roles** con permisos mínimos necesarios

## Endpoints API

Una vez desplegado, la API tendrá los siguientes endpoints:

- `GET /` - Endpoint principal
- `GET /items` - Obtener elementos
- `POST /items` - Crear nuevos elementos

## Limpieza

Para eliminar todos los recursos creados:

```bash
npm run destroy
```

## Seguridad

- Todos los recursos siguen las mejores prácticas de seguridad
- Acceso mínimo necesario (principio de menor privilegio)
- Cifrado habilitado donde sea posible
- Sin acceso público por defecto

## Variables de Entorno

El proyecto utiliza las siguientes variables de entorno:

- `CDK_DEFAULT_ACCOUNT` - Cuenta de AWS (opcional)
- `CDK_DEFAULT_REGION` - Región de AWS (por defecto: us-east-1)

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Crea un Pull Request

## Licencia

MIT License
# cdk
