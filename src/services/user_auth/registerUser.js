const bcrypt = require('bcryptjs');
const pool = require('../../config/db'); 
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const { sendVerificationEmail } = require('./genVerificationEmail');

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
        const userInsertResult = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
            [username, email, hashedPassword]
        );
        const userId = userInsertResult.rows[0].id;
        await sendVerificationEmail(userId, email);

        return { message: 'A verification email has been sent to your email address, Please check.' };
    } catch (err) {
        console.error(err.message);
        throw err;
    }
};

module.exports = { registerUser };
