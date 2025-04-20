/**
 * @swagger
 * tags:
 *   name: User Songs
 *   description: 사용자가 업로드한 곡 관련 API
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: 내가 업로드한 곡 목록 조회
 *     tags: [User Songs]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: 업로드한 곡 리스트 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Song'
 */

/**
 * @swagger
 * /api/user/upload:
 *   post:
 *     summary: 곡 업로드
 *     tags: [User Songs]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My First Song"
 *               coverUrl:
 *                 type: string
 *                 example: "coverimage/abc.png"
 *               songUrl:
 *                 type: string
 *                 example: "audio/xyz.mp3"
 *               duration:
 *                 type: number
 *                 example: 215
 *     responses:
 *       201:
 *         description: 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 */

/**
 * @swagger
 * /api/user/deletesong/{songId}:
 *   delete:
 *     summary: 내가 업로드한 곡 삭제
 *     tags: [User Songs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 *         description: 삭제할 곡의 ID
 *     responses:
 *       200:
 *         description: 삭제 성공 메시지
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Song deleted successfully
 */

