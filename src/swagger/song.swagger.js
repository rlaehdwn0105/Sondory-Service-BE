/**
 * @swagger
 * tags:
 *   name: Songs
 *   description: 곡 관련 API
 */

/**
 * @swagger
 * /api/song:
 *   get:
 *     summary: 모든 곡 조회
 *     tags: [Songs]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: 전체 곡 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Song'
 */

/**
 * @swagger
 * /api/song/recent:
 *   get:
 *     summary: 최근 재생한 곡 조회
 *     tags: [Songs]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: 최근 들은 곡 리스트
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Song'
 */

/**
 * @swagger
 * /api/song/recent/{songId}:
 *   post:
 *     summary: 최근 재생 기록 추가 또는 업데이트
 *     tags: [Songs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: songId
 *         in: path
 *         required: true
 *         description: 곡 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 최근 곡 업데이트 완료
 */

/**
 * @swagger
 * /api/song/{id}:
 *   get:
 *     summary: 특정 유저의 전체 곡 조회
 *     tags: [Songs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 유저 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 유저의 곡 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Song'
 */


