const bcrypt = require('bcryptjs');
const pool = require('../db'); 
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// (?=.*[A-Z]) at least one upper letter
// (?=.*[a-z]) at least one lower letter
// (?=.*\d) at least one number
// (?=.*[@$!%*?&]) at least one spacial letter
// {8,} length must larger than 8

function validatePassword(password) {
    return passwordRegex.test(password);
}

const registerUser = async (username, email, password) => {
    if (!validatePassword(password)){
        throw new Error('Password is invalid');
    }
    
    try {
        // check if email is exist already
        const result = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
        if (result.rows.length > 0) {
            throw new Error('email is already exist'); // if exist throw error
        }

        // password hash
        const hashedPassword = await bcrypt.hash(password, 10);

        // insert new user
        await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
            [username, email, hashedPassword]
        );

        return { message: 'Your account has been successfully registered' };
    } catch (err) {
        console.error(err.message);
        throw err;
    }
};

module.exports = { registerUser };
