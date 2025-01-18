
const crypto = require('crypto');
const pool = require('../config/db')
const transporter = require('../config/VerifyEmail');
require('dotenv').config();
const LOCAL_IP = process.env.LOCAL_IP;
const VerifyToken = async (userId) => {
    try{
        const token = crypto.randomBytes(32).toString('hex')

        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await pool.query(
            'INSERT INTO verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
            [userId, token, expiresAt]
        )
        return token
    }catch(err){
        console.error('Error generating verification token', err.message);
        throw new Error('Fail to generate verify token');
    }

}

const sendVerificationEmail = async (userId, email) => {
    try {
        // 调用生成令牌的函数
        const token = await VerifyToken(userId);

        // 构造验证链接
        const verificationLink = `http://${LOCAL_IP}:3000/api/verify-email?token=${token}`;

        // 邮件内容
        const mailOptions = {
            from: process.env.EMAIL_USER, // 发送方
            to: email,                   // 接收方
            subject: 'Verify your email',       // 邮件主题
            html: `
                <p>Thank you for registering! Please click the link below to verify your email (valid for 5 minutes):</p>
                <a href="${verificationLink}">${verificationLink}</a>
            `
        };

        // 发送邮件
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:', email);
    } catch (err) {
        console.error('Error sending verification email:', err.message);
        throw new Error('Failed to send verification email.');
    }
};



// 导出邮件发送器
module.exports = {sendVerificationEmail };
