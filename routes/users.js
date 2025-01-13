const express = require('express');
const router = express.Router();
const pool = require('../db'); // 引入数据库连接
const { registerUser } = require('../services/registerUser'); // 注意解构方式

// 获取所有用户数据
router.get('/login', async (req, res) => {
    try {
        // 从数据库中查询所有用户
        const result = await pool.query('SELECT password FROM users WHERE email = $1', ['8888888@qq.com']);
        if(result.rows.length == 0){
            throw new Error('邮箱bu存在');
        }
        res.json(result.rows); // 返回查询结果
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).json({ error: err.message });
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
