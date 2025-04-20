/**
 * @swagger
 * /api/stream/{songId}:
 *   get:
 *     summary: CloudFront Signed URL 요청
 *     description: 특정 곡에 대한 CloudFront Signed URL을 반환합니다.
 *     tags: [Stream]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         description: 곡의 고유 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Signed URL 반환 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 signedUrl:
 *                   type: string
 *                   example: "https://de123abc.cloudfront.net/audio/example.wav?Expires=..."
 *       404:
 *         description: 곡을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
