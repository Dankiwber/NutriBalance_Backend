const transporter = require('./genVerificationEmail');

const testSendEmail = async () => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, // 发送方邮箱
            to: 'xw3492700@gmail.com',  // 替换为你想要测试的目标邮箱
            subject: '测试邮件发送',         // 邮件主题
            text: '这是一个测试邮件！',       // 邮件正文（纯文本）
            html: '<h1>测试邮件</h1><p>这是一个测试邮件！</p>' // 邮件正文（HTML 格式）
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
    } catch (err) {
        console.error('Error sending email:', err.message);
    }
};

// 调用测试函数
testSendEmail();
