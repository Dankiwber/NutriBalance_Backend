const express = require('express');
const userRoutes = require('./routes/users'); // 引入用户路由

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// 中间件
app.use(express.json()); // 解析 JSON 请求体

// 测试路由
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ message: 'Database connected!', serverTime: result.rows[0].now });
    } catch (err) {
        console.error('Database connection error:', err.message);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// 挂载用户相关的路由
app.use('/api/users', userRoutes);

// 启动服务器
app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});
