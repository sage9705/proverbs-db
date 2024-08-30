const express = require("express");
const { body, query, param } = require("express-validator");
const proverbController = require("../controllers/proverbController");
const validateRequest = require("../middleware/validateRequest");
const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

/**
 * @swagger
 * /api/proverbs:
 *   get:
 *     summary: Retrieve a list of proverbs
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Language of proverbs
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
 *     parameters:
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Language of proverb
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
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Language of proverbs
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
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
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Proverb ID
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
 *               source:
 *                 type: string
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
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Proverb ID
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
 *               source:
 *                 type: string
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
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Proverb ID
 */
router.delete(
  "/:id",
  [param("id").isMongoId(), validateRequest],
  rateLimiter,
  proverbController.deleteProverb
);

module.exports = router;
