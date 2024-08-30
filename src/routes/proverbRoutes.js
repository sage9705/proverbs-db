const express = require("express");
const { body, query, param } = require("express-validator");
const proverbController = require("../controllers/proverbController");
const validateRequest = require("../middleware/validateRequest");
const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Proverbs
 *   description: Proverb management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Proverb:
 *       type: object
 *       required:
 *         - text
 *         - language
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the proverb
 *         text:
 *           type: string
 *           description: The text of the proverb
 *         language:
 *           type: string
 *           enum: [en, es, fr]
 *           description: The language of the proverb
 *         source:
 *           type: string
 *           description: The source of the proverb
 *       example:
 *         _id: 60d725397de7bf1234567890
 *         text: Actions speak louder than words
 *         language: en
 *         source: Common English Proverbs
 */

/**
 * @swagger
 * /api/proverbs:
 *   get:
 *     summary: Retrieve a list of proverbs
 *     tags: [Proverbs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: The number of items per page
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *           enum: [en, es, fr]
 *         description: Filter proverbs by language
 *     responses:
 *       200:
 *         description: A paginated list of proverbs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Proverb'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *                     itemsPerPage:
 *                       type: integer
 */
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("language").optional().isIn(["en", "es", "fr"]),
    validateRequest,
  ],
  rateLimiter,
  proverbController.getProverbs
);

/**
 * @swagger
 * /api/proverbs/random:
 *   get:
 *     summary: Retrieve a random proverb
 *     tags: [Proverbs]
 *     parameters:
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *           enum: [en, es, fr]
 *         description: Filter random proverb by language
 *     responses:
 *       200:
 *         description: A random proverb
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proverb'
 *       404:
 *         description: No proverbs found
 */
router.get(
  "/random",
  [query("language").optional().isIn(["en", "es", "fr"]), validateRequest],
  rateLimiter,
  proverbController.getRandomProverb
);

/**
 * @swagger
 * /api/proverbs/search:
 *   get:
 *     summary: Search for proverbs
 *     tags: [Proverbs]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *           enum: [en, es, fr]
 *         description: Filter search results by language
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: The number of items per page
 *     responses:
 *       200:
 *         description: A paginated list of proverbs matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Proverb'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *                     itemsPerPage:
 *                       type: integer
 */
router.get(
  "/search",
  [
    query("q").notEmpty(),
    query("language").optional().isIn(["en", "es", "fr"]),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    validateRequest,
  ],
  rateLimiter,
  proverbController.searchProverbs
);

/**
 * @swagger
 * /api/proverbs/{id}:
 *   get:
 *     summary: Get a proverb by ID
 *     tags: [Proverbs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The proverb ID
 *     responses:
 *       200:
 *         description: The proverb details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proverb'
 *       404:
 *         description: Proverb not found
 */
router.get(
  "/:id",
  [param("id").isMongoId(), validateRequest],
  rateLimiter,
  proverbController.getProverbById
);

/**
 * @swagger
 * /api/proverbs:
 *   post:
 *     summary: Create a new proverb
 *     tags: [Proverbs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - language
 *             properties:
 *               text:
 *                 type: string
 *               language:
 *                 type: string
 *                 enum: [en, es, fr]
 *               source:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created proverb
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proverb'
 *       400:
 *         description: Invalid input
 */
router.post(
  "/",
  [
    body("text").notEmpty().trim(),
    body("language").isIn(["en", "es", "fr"]),
    body("source").optional().trim(),
    validateRequest,
  ],
  rateLimiter,
  proverbController.createProverb
);

/**
 * @swagger
 * /api/proverbs/{id}:
 *   put:
 *     summary: Update a proverb
 *     tags: [Proverbs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The proverb ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               language:
 *                 type: string
 *                 enum: [en, es, fr]
 *               source:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated proverb
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proverb'
 *       404:
 *         description: Proverb not found
 */
router.put(
  "/:id",
  [
    param("id").isMongoId(),
    body("text").optional().notEmpty().trim(),
    body("language").optional().isIn(["en", "es", "fr"]),
    body("source").optional().trim(),
    validateRequest,
  ],
  rateLimiter,
  proverbController.updateProverb
);

/**
 * @swagger
 * /api/proverbs/{id}:
 *   delete:
 *     summary: Delete a proverb
 *     tags: [Proverbs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The proverb ID
 *     responses:
 *       200:
 *         description: Proverb deleted successfully
 *       404:
 *         description: Proverb not found
 */
router.delete(
  "/:id",
  [param("id").isMongoId(), validateRequest],
  rateLimiter,
  proverbController.deleteProverb
);

module.exports = router;
