const Redis = require('ioredis');
require('dotenv').config();

// 创建 Redis 客户端，默认连接到本地 Redis（localhost:6379）
const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',  // 使用 docker-compose 提供的服务名
    port: process.env.REDIS_PORT || 6379
});

// Redis 连接成功
redis.on('connect', () => {
    console.log('Redis connected');
});

// Redis 连接出错
redis.on('error', (err) => {
    console.error('Redis connect fail:', err);
});

module.exports = redis;
