const bcrypt = require('bcryptjs');
const pool = require('../../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const verifyPassword = async (password, hashedPassword) => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
        throw new Error('Password is incorrect');
    }
};

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Token 24小时后过期
        },
        JWT_SECRET
    );
};

const loginUser = async (email, password) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            throw new Error('The email is not register');
        }
        const user = result.rows[0];
        const name = user.username
        if (!user.is_verify) {
            throw new Error('Account is inactive. Please contact support.');
        }

        await verifyPassword(password, user.password);
        const token = generateToken(user);
        return { message: 'Login successfully', name , token };
       
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = { loginUser };
