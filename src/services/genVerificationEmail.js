const nodemailer = require('nodemailer');

require('dotenv').config(); // 加载 .env 文件

// 配置邮件发送器
const transporter = nodemailer.createTransport({
    service: 'Gmail', // 使用 Gmail 服务
    auth: {
        user: process.env.EMAIL_USER, // 从 .env 文件中读取
        pass: process.env.EMAIL_PASS  // 从 .env 文件中读取
    }
});

// 导出邮件发送器
module.exports = transporter;
