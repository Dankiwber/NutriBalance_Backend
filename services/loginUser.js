const bcrypt = require('bcrypt');
const pool = require('../db'); // 引入数据库连接池
const jwt = require("jsonwebtoken")
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET
const loginUser = async (email, password) => {
    try {
        // 检查邮箱是否存在
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            throw new Error('email and password does not match'); 
        }

        // 如果邮箱存在，继续验证密码
        const user = result.rows[0];
        const hashedPassword = user.password;

        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (!isMatch) {
            throw new Error('email and password does not match');
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Token 24小时后过期
            },
            JWT_SECRET
        );

        return { message: 'Login successfully', token};
    } catch (err) {
        throw err; // 将错误抛出给调用者处理
    }
};

module.exports = { loginUser };