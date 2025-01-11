const express = require('express');
const router = express.Router();
const pool = require('../db'); // 引入数据库连接

// 获取所有用户数据
router.get('/', async (req, res) => {
    try {
        // 从数据库中查询所有用户
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows); // 返回查询结果
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

module.exports = router;
