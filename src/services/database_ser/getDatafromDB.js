const pool = require('../../config/db');

// 计算当前周的起始日期（从周日开始）
const getCurrentWeekRange = () => {
    const d = new Date(); // 本机时间
    const currentDay = d.getDay(); // 0 = 周日, 1 = 周一, ..., 6 = 周六

    // 计算周日（本周第一天）
    const firstday = new Date(d);
    firstday.setDate(d.getDate() - currentDay);

    // 计算周六（本周的最后一天）
    const lastday = new Date(firstday);
    lastday.setDate(firstday.getDate() + 6);

    // 格式化日期（YYYY-MM-DD）
    const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    return {
        today: formatDate(new Date()), // 确保 today 是 YYYY-MM-DD
        start_date: formatDate(firstday),
        end_date: formatDate(lastday)
    };
};

const getData = async (userid) => {
    try {
        const { today, start_date, end_date } = getCurrentWeekRange(); // 计算本周的起始日期
        
        console.log("查询范围:", start_date, "到", end_date); // Debug info

        // 执行 SQL 查询
        const weekly_cal = await pool.query(`
            SELECT 
                TO_CHAR(record_at, 'YYYY-MM-DD') AS day,
                SUM(protein_intake) AS total_protein,
                SUM(fat_intake) AS total_fat,
                SUM(carb_intake) AS total_carb,
                SUM(total_cal) AS total_calories
            FROM intake_hist
            WHERE userid = $1
            AND record_at >= $2
            AND record_at <= $3::DATE + INTERVAL '1 day'
            GROUP BY day
            ORDER BY day;
        `, [userid, start_date, end_date]);
            console.log(end_date)
        // 初始化每日摄入数据
        const date_arr = {};
        let today_intake = []; // 今日摄入数据
        let temp_date = new Date(start_date);
        const end_date_obj = new Date(end_date);

        while (temp_date <= end_date_obj) {  // 包含最后一天
            const formatted_date = temp_date.toISOString().split('T')[0]; // 格式化为 YYYY-MM-DD
            date_arr[formatted_date] = '0'; // 初始化为 '0'
            temp_date.setDate(temp_date.getDate() + 1); // 增加一天
        }

        // 处理查询结果
        
        weekly_cal.rows.forEach(element => {
            if (date_arr.hasOwnProperty(element.day)) {
                date_arr[element.day] = element.total_calories;
            }

            // 判断是否是今天的数据
            if (element.day === today) {
                today_intake = [element.total_protein, element.total_fat, element.total_carb, element.total_calories];
            }
        });
        
        
        return [today_intake, date_arr];

    } catch (err) {
        console.error("database checking fail ", err.message);
        return [[], {}]; 
    }
};
const getInfo = async (userid) => {
    try {
        const userinfo = await pool.query(`
            SELECT daily_goal, age, gender 
            FROM user_info 
            where userid = $1;
            `,[userid]);
        const info = userinfo.rows[0]
        if (Object.keys(info).length != 3){
            throw new Error("database return format error")
        }
        return info
        
    }catch(err){
        console.error("database checking fail", err.message);
        return {};
    }
}
getInfo(40)
module.exports = { getData, getInfo};
