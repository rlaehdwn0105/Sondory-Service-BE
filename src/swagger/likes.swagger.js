/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: 좋아요 관련 API
 */

/**
 * @swagger
 * /api/like:
 *   get:
 *     summary: 내가 좋아요한 곡 목록 조회
 *     tags: [Likes]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: 좋아요한 곡 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Song'
 */

/**
 * @swagger
 * /api/like/{songId}:
 *   post:
 *     summary: 특정 곡에 좋아요 추가
 *     tags: [Likes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: 좋아요할 곡의 ID
 *     responses:
 *       201:
 *         description: 좋아요 등록 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 liked:
 *                   type: boolean
 *                   example: true
 */

/**
 * @swagger
 * /api/like/{songId}:
 *   delete:
 *     summary: 특정 곡에 좋아요 취소
 *     tags: [Likes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: 좋아요 취소할 곡의 ID
 *     responses:
 *       200:
 *         description: 좋아요 취소 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 liked:
 *                   type: boolean
 *                   example: false
 */
