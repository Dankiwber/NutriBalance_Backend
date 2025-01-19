const crypto = require('crypto');
const pool = require('../config/db');
const redis = require('./services/redisClient');
const transporter = require('./services/genVerificationEmail');
require('dotenv').config();
const LOCAL_IP = process.env.LOCAL_IP;

const requestPasswordReset = async (email) => {
    try {
        // 检查邮箱是否存在
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            throw new Error('Email not registered.');
        }

        // 生成随机令牌
        const token = crypto.randomBytes(32).toString('hex');
        
        // 设置令牌过期时间 (15 分钟)
        await redis.setex(`resetPassword:${token}`, 900, email);

        // 邮件内容
        const resetLink = `http://${LOCAL_IP}:3000/api/reset-password?token=${token}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Your Password',
            html: `<p>Click the following link to reset your password:</p>
                   <a href="${resetLink}">${resetLink}</a>
                   <p>This link will expire in 15 minutes.</p>`
        });

        return { message: 'Password reset email sent.' };
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = { requestPasswordReset };