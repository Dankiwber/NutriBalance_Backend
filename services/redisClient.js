const Redis = require('ioredis');

// 创建 Redis 客户端，默认连接到本地 Redis（localhost:6379）
const redis = new Redis({
    host: '127.0.0.1', // Redis 主机地址
    port: 6380,        // Redis 端口
});

// Redis 连接成功
redis.on('connect', () => {
    console.log('Redis 连接成功');
});

// Redis 连接出错
redis.on('error', (err) => {
    console.error('Redis 连接失败:', err);
});

module.exports = redis;
