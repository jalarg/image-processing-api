# 📸 API de Procesamiento de Imágenes

## 📌 Descripción

Esta API permite la subida y procesamiento de imágenes de forma asíncrona utilizando **BullMQ** y **Redis** para gestionar colas de tareas. Implementa una arquitectura hexagonal con **Node.js, TypeScript, MongoDB y Sharp** para la manipulación de imágenes.

---

## 🚀 Instalación y Configuración

### 🔹 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

Docker

### 🔹 Instalación

1. Clona este repositorio:

   ```bash
   gh repo clone jalarg/image-processing-api
   cd image-processing-api
   ```

2. Instala las dependencias del proyecto y corre el build:

   ```bash
   npm install
   npm run build
   ```

3. Copia el archivo de variables de entorno y configúralo:

   ```bash
   cp .env.example .env
   ```

4. Asegúrate de que MongoDB y Redis estén corriendo en tu sistema o en Docker.

5. Construye y levanta los contenedores Docker:

   ```bash
   docker-compose up -d --build
   ```

6. Check API health

   ```bash
   curl http://localhost:4000/api/health
   ```

7. Para detener los contenedores:

   ```bash
   docker-compose down
   ```

---

## 📁 Seed de la database

Para correr el seed con datos ejemplo:

```bash
docker-compose run api ts-node src/infrastructure/database/seed-database.ts
```

Verificar la Base de Datos

Para comprobar que la base de datos se ha poblado correctamente, accede al contenedor de MongoDB y ejecuta los siguientes comandos:

1. Accede al contenedor de MongoDB:

```bash
docker exec -it < CONTAINER NAME > mongosh
```

2. Buscar la BBDD

```bash
show dbs
```

3. Seleccionar la BBDD

```bash
 use image-processing
```

4. Comando para Verificar la Colección (Ej. contar collection)

```bash
db.tasks.countDocuments()
```

---

## 📁 Endpoints de la API

### 🔹 Crear una tarea de procesamiento de imagen

```http
POST /api/tasks
```

#### 📞 Body de la solicitud (JSON):

```json
{
  "originalPath": "https://mi-imagen.com/image.jpg"
}
```

#### 💌 Respuesta esperada (JSON):

```json
{
  "taskId": "65c24be4d11aaa0e18ad0673",
  "status": "pending",
  "price": 20.5
}
```

---

### 🔹 Obtener el estado de una tarea de procesamiento

```http
GET /api/tasks/:taskId
```

#### 📞 Parámetros de la solicitud:

- `taskId` (string, requerido): ID de la tarea a consultar.

#### 💌 Respuesta esperada (JSON):

##### ✅ **Si la tarea está completada**:

```json
{
  "taskId": "65d4a54b89c5e342b2c2c5f6",
  "status": "completed",
  "price": 25.5,
  "images": [
    {
      "resolution": "1024",
      "path": "/output/image1/1024/f322b730b287da77e1c519c7ffef4fc2.jpg"
    },
    {
      "resolution": "800",
      "path": "/output/image1/800/202fd8b3174a774bac24428e8cb230a1.jpg"
    }
  ]
}
```

##### ⏳ **Si la tarea está pendiente**:

```json
{
  "taskId": "65d4a54b89c5e342b2c2c5f6",
  "status": "pending",
  "price": 25.5,
  "images": []
}
```

##### ❌ **Si la tarea ha fallado**:

```json
{
  "taskId": "65d4a54b89c5e342b2c2c5f6",
  "status": "failed",
  "price": 25.5,
  "images": []
}
```

## 🧪 Pruebas

Ejecuta las pruebas unitarias con Vitest:

```bash
npm run test
```

Ejecuta las pruebas de integracion:

```bash
npm run test:integration
```

Para pruebas en modo observación:

```bash
npm run test:watch
```
