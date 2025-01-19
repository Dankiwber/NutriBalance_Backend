const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // 引入数据库连接
const redis = require('../services/redisClient');
const bcrypt = require('bcryptjs');
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const { requestPasswordReset } = require('../services/passwordReset');

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
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // 从 Redis 获取与令牌对应的 email
        const email = await redis.get(`resetPassword:${token}`);

        if (!email) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        if (!passwordRegex.test(newPassword)){
            return res.status(400).json({ message: 'Invalid password' });
        }
        // 对新密码进行加密
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 更新用户密码
        await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);

        // 删除 Redis 中的令牌，避免重复使用
        await redis.del(`resetPassword:${token}`);

        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to reset password.' });
    }
});

module.exports = router;
