/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: User registration
 *     description: Register a new user with email, username, and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               username:
 *                 type: string
 *                 example: "tester"
 *     responses:
 *       201:
 *         description: Verification email sent
 *       400:
 *         description: Invalid input or duplicate info
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Log in with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       403:
 *         description: Email not verified
 *       400:
 *         description: Wrong password
 */

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Email verification
 *     description: Verify email with token from email link
 *     tags: [Auth]
 *     parameters:
 *       - name: token
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token sent by email
 *     responses:
 *       200:
 *         description: Email verified
 *       400:
 *         description: Invalid or expired token
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout
 *     description: Clear JWT cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */

/**
 * @swagger
 * /api/auth/authCheck:
 *   get:
 *     summary: Check authentication
 *     description: Check if user is authenticated
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User authenticated
 */