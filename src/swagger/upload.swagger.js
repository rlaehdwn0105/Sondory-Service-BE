/**
 * @swagger
 * /api/upload/presign:
 *   post:
 *     summary: Generate a presigned S3 URL for file upload
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - filename
 *               - contentType
 *               - type
 *             properties:
 *               filename:
 *                 type: string
 *                 example: "song.mp3"
 *               contentType:
 *                 type: string
 *                 example: "audio/mpeg"
 *               type:
 *                 type: string
 *                 enum: [audio, image]
 *                 example: "audio"
 *     responses:
 *       200:
 *         description: Presigned URL created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 presignedUrl:
 *                   type: string
 *                   example: "https://s3.amazonaws.com/yourbucket/audio/uuid.mp3?..."
 *                 key:
 *                   type: string
 *                   example: "audio/uuid.mp3"
 *       400:
 *         description: Missing or invalid input
 *       500:
 *         description: Server error
 */
