# 📸 API de Procesamiento de Imágenes

## 📌 Descripción

Esta API permite la subida y procesamiento de imágenes de forma asíncrona utilizando **BullMQ** y **Redis** para gestionar colas de tareas. Implementa una arquitectura hexagonal con **Node.js, TypeScript, MongoDB y Sharp** para la manipulación de imágenes.

---

## 🚀 Instalación y Configuración

### 🔹 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js 20+](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [MongoDB Atlas o Local](https://www.mongodb.com/atlas/database)
- [Redis](https://redis.io/) _(Docker recomendado)_

### 🔹 Instalación

1. Clona este repositorio:

   ```bash
   gh repo clone jalarg/image-processing-api
   cd image-processing-api
   ```

2. Instala las dependencias del proyecto:

   ```bash
   npm install
   ```

3. Copia el archivo de variables de entorno y configúralo:

   ```bash
   cp .env.example .env
   ```

4. Asegúrate de que MongoDB y Redis estén corriendo en tu sistema o en Docker.

---

### 🔹 Configuración de MongoDB

Este proyecto requiere una conexión a **MongoDB**. Puedes usar **MongoDB Atlas** o una instancia local. Configura la variable `MONGO_URI` en tu archivo `.env`:

#### **📌 Opción 1: MongoDB en Docker (recomendado)**

Si usas `docker-compose`, la API se conectará automáticamente con este valor:

```env
MONGO_URI=mongodb://mongodb:27017/image-processing
```

#### **📌 Opción 2: MongoDB Atlas (Cloud)**

Si prefieres usar **MongoDB Atlas**, reemplaza `MONGO_URI` en `.env` con tu cadena de conexión:

```env
MONGO_URI=mongodb+srv://usuario:contraseña@cluster0.mongodb.net/image-processing?retryWrites=true&w=majority
```

> 📌 **Nota:** Recuerda reemplazar `usuario`, `contraseña` y `cluster0.mongodb.net` con los datos de tu base de datos en Atlas.

---

## 🐳 Dockerización

Puedes ejecutar la aplicación dentro de contenedores Docker.

### 🔹 Construcción de las imagenes

```bash
docker compose up -d --build
```

### 🔹 Detener a los contenedores

```bash
docker compose down
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

---

## 🚦 Monitoreo de la cola de tareas

Puedes verificar las tareas en la cola de Redis:

```bash
redis-cli
SELECT 1
LRANGE bull:imageProcessing:waiting 0 -1
```

Si la tarea ha sido completada:

```bash
LRANGE bull:imageProcessing:completed 0 -1
```

---

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
