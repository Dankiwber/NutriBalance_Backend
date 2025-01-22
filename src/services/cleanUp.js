const pool = require('../config/db');

// 定期清理未验证用户
const cleanupUnverifiedUsers = async () => {
    try {
        const currentTime = new Date();

        // 删除超过 15 分钟未验证的用户
        const result = await pool.query(
            `DELETE FROM users 
             WHERE is_verify = FALSE 
               AND id IN (
                 SELECT user_id 
                 FROM verification_tokens 
                 WHERE expires_at < $1
               )`,
            [currentTime]
        );

        console.log(`Deleted ${result.rowCount} unverified users.`);
    } catch (err) {
        console.error('Error cleaning up unverified users:', err.message);
    }
};

module.exports = cleanupUnverifiedUsers;
