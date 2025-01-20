const express = require('express');
const cors = require('cors')
const authRoutes = require('./routes/auth'); // 引入用户路由
const userRoutes = require('./routes/user'); // 引入用户路由
const pool = require('./config/db'); // 引入数据库连接
require('dotenv').config(); 
const cleanupUnverifiedUsers = require('./services/cleanUp');
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
app.use(cors({
    origin: process.env.CORS_ORIGIN, 
}));
// 中间件
app.use(express.json()); // 解析 JSON 请求体

app.get('/', (req, res) => {
    res.send('Welcome to the API! Use /api/register to register or /test-db to test the database connection.');
});


// 挂载用户相关的路由
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ message: 'Database connected!', time: result.rows[0].now });
    } catch (err) {
        console.error('Database connection error:', err.message);
        res.status(500).json({ error: 'Database connection failed' });
    }
});
setInterval(() => {
    cleanupUnverifiedUsers();
}, 60 * 60 * 1000); // 每 10 分钟执行一次

// 启动服务器
app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});
