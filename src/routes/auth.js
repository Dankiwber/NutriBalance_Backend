const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // 引入数据库连接
const { registerUser } = require('../services/registerUser'); // 注意解构方式
const { loginUser } = require('../services/loginUser');
const authMiddleware = require('../middlewares/authMiddleware'); // 引入中间件
const { add, has } = require('../services/Token_blacklist'); // 引入黑名单工具
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/logout', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        // 验证令牌有效性
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded Token:', decoded);

        // 检查 token 是否已在黑名单
        const isBlacklisted = await has(token);
        if (isBlacklisted) {
            console.warn('Token already in blacklist, skipping addition.');
            return res.status(400).json({ message: 'Token already in blacklist' });
        }

        // 将 token 添加到黑名单
        await add(token, decoded.exp);
        res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            console.warn('Token has expired.');
            return res.status(400).json({ message: 'Token is already expired' });
        }
        console.error('Logout Error:', err.message);
        res.status(400).json({ error: 'Invalid or expired token' });
    }
});

const path = require('path'); // Node.js 模块，用于处理文件路径

router.get('/verify-email', async (req, res) => {
    const { token } = req.query; // 从查询参数中获取令牌

    try {
        // 检查令牌是否存在
        const result = await pool.query(
            'SELECT user_id, expires_at FROM verification_tokens WHERE token = $1',
            [token]
        );

        if (result.rows.length === 0) {
            // 如果令牌无效，返回错误页面
            return res.status(400).sendFile(path.join(__dirname, '../../public/tokenExpired.html'));
        }

        const { user_id, expires_at } = result.rows[0];

        
        if (new Date() > new Date(expires_at)) {
            // 如果令牌已过期，返回过期页面
            return res.status(400).sendFile(path.join(__dirname, '../../public/tokenExpired.html'));
        }

        // 更新用户的 is_verify 字段为 TRUE
        await pool.query('UPDATE users SET is_verify = TRUE WHERE id = $1', [user_id]);

        // 删除已使用的验证令牌
        await pool.query('DELETE FROM verification_tokens WHERE token = $1', [token]);

        // 如果验证成功，返回成功页面
        return res.status(200).sendFile(path.join(__dirname, '../../public/emailVerified.html'));
    } catch (err) {
        console.error('Error verifying email:', err.message);
        // 如果发生服务器错误，返回通用错误页面
        return res.status(500).send('<h1>Internal Server Error</h1>');
    }
});


// 示例受保护路由：获取用户个人信息
router.get('/profile', authMiddleware, (req, res) => {
    // 通过中间件，req.user 中已经包含了解码后的用户信息
    res.json({
        message: 'Token is all good',
        user: req.user, // 返回用户信息
    });
});
// 获取所有用户数据
router.post('/login', async (req, res) => {
    const { email, password } = req.body; // 从请求体中获取用户输入

    try {
        const result = await loginUser(email, password); // 调用登录逻辑
        res.status(200).json(result); // 成功返回 JWT 和提示信息
    } catch (err) {
        res.status(400).json({ error: err.message }); // 登录失败返回错误信息
    }
});
 
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const result = await registerUser(username, email, password);
        res.status(201).json(result); // 返回成功消息
    } catch (err) {
        res.status(400).json({ error: err.message }); // 返回错误消息
    }
});


module.exports = router;
