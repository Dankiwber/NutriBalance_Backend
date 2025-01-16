const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET
const tokenBlacklist = require('../blacklist'); // 引入黑名单
require('dotenv').config();


// 验证 JWT 的中间件
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization']; // 获取请求头中的 Authorization 字段

    // 如果请求头中没有 Authorization 字段
    if (!authHeader) {
        return res.status(401).json({ message: '未授权，请登录' });
    }
    
    // 提取 Bearer 后的 Token
    const token = authHeader.split(' ')[1];
    if (!token || tokenBlacklist.has(token)) {
        return res.status(401).json({ message: '无效的令牌' });
    }

    try {
        // 验证 Token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // 将解码后的用户信息存入 req 对象
        next(); // 验证通过，继续处理请求
    } catch (err) {
        res.status(401).json({ message: '令牌无效或已过期' });
    }
};

module.exports = authMiddleware;
