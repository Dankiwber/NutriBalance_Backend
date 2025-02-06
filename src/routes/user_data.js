const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // 引入中间件
const { getData, getInfo } = require('../services/database_ser/getDatafromDB')

router.get('/weekly_cal', authMiddleware, async (req, res) => {
    try {
        const userid = req.user?.id; // 确保 user 对象存在
        if (!userid) {
            return res.status(400).json({ error: "User ID is missing or invalid." });
        }

        const intake_data = await getData(userid);

        if (!intake_data || !Array.isArray(intake_data) || intake_data.length !== 2) {
            return res.status(500).json({ error: "Failed to fetch intake data." });
        }

        res.json({
            daily_intake: intake_data[0] || [], // 确保 daily_intake 是数组
            weekly_intake: intake_data[1] || {} // 确保 weekly_intake 是对象
        });

    } catch (err) {
        console.error("API error:", err.message);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
});

router.get('/user_info', authMiddleware, async (req, res) => {
    try {
        const userid = req.user?.id; // 确保 user 对象存在
        if (!userid) {
            return res.status(400).json({ error: "User ID is missing or invalid." });
        }

        const userinfo = await getInfo(userid);

        res.json({
            userinfo: userinfo
        });

    } catch (err) {
        console.error("API error:", err.message);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
});

router.post('/db_data_update', authMiddleware, async (req, res) => {
    try{
        const { data } = req.body;
        const userid = req.user?.id;

    }catch(err){
        console.error("API error:", err.message);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
})
module.exports = router;