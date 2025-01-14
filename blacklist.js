// 使用 Set 来存储被禁用的 Token
const tokenBlacklist = new Set();

module.exports = {
    // 添加 Token 到黑名单
    add: (token) => tokenBlacklist.add(token),

    // 检查 Token 是否在黑名单中
    has: (token) => tokenBlacklist.has(token),

    // 删除 Token（可选，用于定期清理过期令牌）
    remove: (token) => tokenBlacklist.delete(token),

    // 查看当前黑名单（调试用）
    getAll: () => Array.from(tokenBlacklist),
};
