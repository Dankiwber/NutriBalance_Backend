const redis = require('./services/redisClient');

async function testRedis() {
    try {
        // 存储一个键值对
        await redis.set('testKey', 'testValue', 'EX', 10); // 10秒过期
        console.log('数据已存储到 Redis');

        // 读取键值对
        const value = await redis.get('testKey');
        console.log('从 Redis 获取的值:', value);

        // 等待 11 秒后检查是否已过期
        setTimeout(async () => {
            const expiredValue = await redis.get('testKey');
            console.log('过期后的值:', expiredValue); // 应为 null
        }, 11000);
    } catch (err) {
        console.error('Redis 操作失败:', err);
    }
}

testRedis();
