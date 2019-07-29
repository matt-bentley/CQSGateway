const express = require('express');
const router = express.Router();

require('./routes/dynamic')(router);

module.exports = router;