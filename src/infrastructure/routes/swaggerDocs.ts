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
