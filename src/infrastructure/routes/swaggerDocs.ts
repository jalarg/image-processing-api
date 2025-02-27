/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verificación de estado de la API
 *     description: Devuelve el estado de la API para asegurar que está funcionando correctamente
 *     responses:
 *       200:
 *         description: La API está en funcionamiento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Crear una nueva tarea
 *     description: Crea una nueva tarea con la información proporcionada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               originalPath:
 *                 type: string
 *                 description: La URL original de la imagen
 *                 example: "https://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Tarea creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 taskId:
 *                   type: string
 *                   description: El ID de la tarea creada
 *                 status:
 *                   type: string
 *                   description: El estado de la tarea
 *                 price:
 *                   type: number
 *                   description: El precio de la tarea
 *       400:
 *         description: Solicitud incorrecta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing originalPath in request body"
 */

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   get:
 *     summary: Obtener una tarea por ID
 *     description: Recupera una tarea utilizando su ID
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID de la tarea
 *     responses:
 *       200:
 *         description: Tarea recuperada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 taskId:
 *                   type: string
 *                   description: El ID de la tarea
 *                 status:
 *                   type: string
 *                   description: El estado de la tarea
 *                 price:
 *                   type: number
 *                   description: El precio de la tarea
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Lista de imágenes asociadas a la tarea
 *       404:
 *         description: Tarea no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task not found"
 */
