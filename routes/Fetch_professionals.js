const express = require('express');
const router = express.Router();
const fetch_professionals_controller = require('../controller/Fetch_professionals_controller');

router.get('/', fetch_professionals_controller.fetch_professionals_handler);
router.get('/:id', fetch_professionals_controller.fetch_professional_handler);

module.exports = router