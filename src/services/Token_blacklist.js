const redis = require('../config/redisClient'); // 引入 Redis 客户端

module.exports = {
    // 添加令牌到黑名单
    add: async (token, exp) => {
        const ttl = exp - Math.floor(Date.now() / 1000);
        console.log('Adding Token to Blacklist:', token, 'TTL:', ttl);
        if (ttl > 0) {
            try {
                await redis.setex(`blacklist:${token}`, ttl, 'blacklisted');
                console.log(`Token added to Redis blacklist with TTL: ${ttl}`);
            } catch (err) {
                console.error('Redis setex Error:', err.message);
            }
        } else {
            console.warn('Token already expired, not added to blacklist.');
        }
    },    

    // 检查令牌是否在黑名单中
    has: async (token) => {
        const result = await redis.get(`blacklist:${token}`);
        console.log('Blacklist Check Result:', result); // 调试输出
        return result === 'blacklisted';
    },
};
