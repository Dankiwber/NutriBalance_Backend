const bcrypt = require('bcrypt');
const pool = require('../db'); // 引入数据库连接池

const loginUser = async (email, password) => {
    try {
        // 检查邮箱是否存在
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            throw new Error('邮箱或密码错误'); // 返回更模糊的信息
        }

        // 如果邮箱存在，继续验证密码
        const user = result.rows[0];
        const hashedPassword = user.password;
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (!isMatch) {
            throw new Error('邮箱或密码错误');
        }

        return { message: '登录成功', userId: user.id, username: user.username };
    } catch (err) {
        throw err; // 将错误抛出给调用者处理
    }
};

module.exports = { loginUser };