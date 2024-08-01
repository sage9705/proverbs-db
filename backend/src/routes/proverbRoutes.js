const express = require('express');
const router = express.Router();
const proverbController = require('../controllers/proverbController');

router.post('/', proverbController.createProverb);
router.get('/', proverbController.getProverbs);
router.get('/:id', proverbController.getProverbById);
router.put('/:id', proverbController.updateProverb);
router.delete('/:id', proverbController.deleteProverb);

module.exports = router;