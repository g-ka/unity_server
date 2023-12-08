const express = require('express');
const router = express.Router();
const search_controller = require('../controller/Search_controller');

router.post('/', search_controller.search_handler);

module.exports = router