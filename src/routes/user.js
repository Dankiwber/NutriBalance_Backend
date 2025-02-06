const express = require('express');
const router = express.Router();
const { ERROR_MESSAGES } = require('../config/chatbot_prompt');
const { verifyResetCode, resetPassword, requestPasswordReset  } = require('../services/user_auth/resetPassword');
const { chatbot } = require('../services/chatbot_ser/deepseek_chatbot')
const authMiddleware = require('../middlewares/authMiddleware'); // 引入中间件
// 点击forget password后访问的api

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        await requestPasswordReset(email);
        res.status(200).json({ message: 'Password reset email sent.' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 用于验证“重置验证码” 的api
router.post('/verify-reset-code', async (req, res) => {
    const { email, code } = req.body;
    try {
        const response = await verifyResetCode(email, code);
        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
// “重置验证码” 通过验证后重设密码的api
router.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const response = await resetPassword(email, newPassword);
        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/query_process', authMiddleware, async (req, res) => {
  const { query } = req.body;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Invalid request format' });
  }
  try {
    const response = await chatbot(query);
    res.status(200).json(response);
  } catch (err) {
    const statusCode = err.message === ERROR_MESSAGES.INVALID_INPUT ? 400 : 500;
    const clientMessage = statusCode === 500 ? ERROR_MESSAGES.SERVER_ERROR : err.message;
    
    console.error(`API Error [${statusCode}]: ${err.message}`);
    res.status(statusCode).json({ 
      error: clientMessage,
      ...(process.env.NODE_ENV === 'development' && { debug: err.stack })
    });
  }
});
module.exports = router;
