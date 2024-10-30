const express = require('express');
const { verifyCode, generateCodes } = require('../controllers/codeController');
const router = express.Router();

router.post('/verify-code', verifyCode);
router.post('/generate-codes', generateCodes);

module.exports = router;