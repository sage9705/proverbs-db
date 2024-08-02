const express = require('express');
const router = express.Router();
const proverbController = require('../controllers/proverbController');

router.get('/', proverbController.getProverbs);
router.get('/random', proverbController.getRandomProverb);
router.get('/search', proverbController.searchProverbs);
router.get('/:id', proverbController.getProverbById);
router.post('/', proverbController.createProverb);
router.put('/:id', proverbController.updateProverb);
router.delete('/:id', proverbController.deleteProverb);

module.exports = router;