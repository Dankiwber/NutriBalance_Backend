const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // 引入数据库连接
const redis = require('../config/redisClient');
const bcrypt = require('bcryptjs');
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const { verifyResetCode, resetPassword, requestPasswordReset  } = require('../services/resetPassword');

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        await requestPasswordReset(email);
        res.status(200).json({ message: 'Password reset email sent.' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 处理用户访问重置链接
router.post('/verify-reset-code', async (req, res) => {
    const { email, code } = req.body;
    try {
        const response = await verifyResetCode(email, code);
        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const response = await resetPassword(email, newPassword);
        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
