const express = require('express');
const router = express.Router();

const { getPosts, getPostById } = require('../controllers/postController');

router.get('/', getPosts);
router.get('/:id', getPostById);

module.exports = router;