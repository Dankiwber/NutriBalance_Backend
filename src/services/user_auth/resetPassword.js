const crypto = require('crypto');
const pool = require('../../config/db');
const redis = require('../../config/redisClient');
const transporter = require('../../config/VerifyEmail');
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
require('dotenv').config();
const LOCAL_IP = process.env.LOCAL_IP;

const bcrypt = require('bcryptjs');

const verifyResetCode = async (email, code) => {
    try {
        const storedCode = await redis.get(`resetPassword:${email}`);
        if (!storedCode) {
            throw new Error('Verification code expired or not found.');
        }

        if (storedCode !== code) {
            throw new Error('Invalid verification code.');
        }

        // 验证成功后，删除验证码
        await redis.del(`resetPassword:${email}`);

        return { message: 'Verification successful, you can reset your password now.' };
    } catch (err) {
        throw new Error(err.message || 'Something went wrong, please try again');
    }
};


const resetPassword = async (email, newPassword) => {
    
    try {
        if (!passwordRegex.test(newPassword) || !email){
            throw new Error('Password Format incorrect.');
        }
        result = await pool.query("SELECT password FROM users WHERE email = $1", [email])
        
        const oldPassword = result.rows[0].password;
        
        const isMatch = await bcrypt.compare(newPassword, oldPassword)
        
        if (isMatch) {
            throw new Error('New password cannot be the same as your old password')
        }else{
            console.log("not match")
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);

        return { message: 'Password reset successfully. You can now log in with your new password.' };
    } catch (err) {
        throw new Error(err.message || 'Failed to reset password.');
    }
}; 


const requestPasswordReset = async (email) => {
    try {
        // 检查邮箱是否存在
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        console.log(result.rows)
        if (result.rows.length === 0) {
            throw new Error('Email not registered.');
        }

        // 生成随机令牌
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // 设置令牌过期时间 (15 分钟)
        await redis.setex(`resetPassword:${email}`, 900, verificationCode);

        // 邮件内容
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Password Reset Code',
            html: `<p>Your password reset code is:</p>
                   <h2>${verificationCode}</h2>
                   <p>This code will expire in 15 minutes.</p>`
        });

        return { message: 'Password reset email sent.' };
    } catch (err) {
        throw new Error(err.message);
    }
};


module.exports = { verifyResetCode, resetPassword, requestPasswordReset };