const express = require('express');
const router = express.Router();
const { ERROR_MESSAGES } = require('../config/constants');
const { verifyResetCode, resetPassword, requestPasswordReset  } = require('../services/resetPassword');
const { chatbot } = require('../services/deepseek_chatbot')
const { getData } = require('../services/getDatafromDB')
router.post('/weekly_cal', authMiddleware, async (req, res) => {
    try {
        const userid = req.user.id; // 从 JWT 获取用户 ID
        
        const intake_data = getData(userid)
        res.json({
            daily_intake: intake_data[0],
            weekly_intake: intake_data[1]
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }

})