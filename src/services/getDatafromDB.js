const pool = require('../config/db');

// 计算当前周的起始日期（从周日开始）
const getCurrentWeekRange = () => {
    const d = new Date(); // 本机时间
    // 获取当前是星期几（0=周日, 1=周一, ..., 6=周六）
    const currentDay = d.getDay(); 
    // 计算周日（如果今天是周日，则当前日期就是本周第一天）
    const firstday = new Date(d);
    firstday.setDate(d.getDate() - currentDay); 

    // 计算下周六（本周的最后一天）
    const lastday = new Date(firstday);
    lastday.setDate(firstday.getDate() + 6); 
    
    const formatDate = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };
    
    return {
        today : formatDate(d),
        start_date: formatDate(firstday),  
        end_date: formatDate(lastday)      
    };
};

const getData = async (userid) => {
    const { today, start_date, end_date } = getCurrentWeekRange(); // 计算周起始日期
    
    console.log("查询范围:", start_date, "到", end_date); // Debug 输出

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
        AND record_at < $3
        GROUP BY day
        ORDER BY day;
    `, [userid, start_date, end_date]);
    const date_arr = {};
    var today_intake = []
    let temp_date = new Date(start_date); // 确保 temp_date 是 Date 对象
    const end_date_obj = new Date(end_date); // 确保 end_date 也是 Date 对象

    while (temp_date <= end_date_obj) {  // 包含最后一天
        date_arr[temp_date.toISOString().split('T')[0]] = 0; // 格式化为 YYYY-MM-DD
        temp_date.setDate(temp_date.getDate() + 1); // 增加一天
    }
    weekly_cal.rows.forEach(function(element) {
        if (element.day in date_arr){
            date_arr[element.day]= element.total_calories
        }
        if (element.day in date_arr && element.day === today){
            today_intake = [element.total_protein, element.total_fat, element.total_carb, element.total_calories]
        }
    });

    console.log([today_intake, date_arr][0])
    return [today_intake, date_arr]
};
module.exports = { getData };
