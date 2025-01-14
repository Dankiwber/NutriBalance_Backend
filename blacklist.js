const redis = require('./services/redisClient');

module.exports = {
    // 添加 Token 到黑名单，设置过期时间
    add: async (token, exp) => {
        const ttl = exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
            await redis.setex(`blacklist:${token}`, ttl, 'blacklisted');
        }
    },

    // 检查 Token 是否在黑名单中
    has: async (token) => {
        const result = await redis.get(`blacklist:${token}`);
        return result === 'blacklisted';
    },
};
