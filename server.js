const express = require('express');
const cors = require('cors')
const userRoutes = require('./routes/users'); // 引入用户路由
const pool = require('./db'); // 引入数据库连接
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
app.use(cors({
    origin: process.env.CORS_ORIGIN, 
}));
// 中间件
app.use(express.json()); // 解析 JSON 请求体

app.get('/', (req, res) => {
    res.send('Welcome to the API! Use /api/register to register or /api/test-db to test the database connection.');
});


// 挂载用户相关的路由
app.use('/api', userRoutes);

// 启动服务器
app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});
