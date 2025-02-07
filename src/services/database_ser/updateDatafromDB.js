const pool = require('../../config/db')

const insertData = async (record_update, current_intake, date, userid, daily_goal) => {
    try{
        const InsertFoodRecord = await pool.query(
            `INSERT INTO intake_hist (userid, protein_intake, fat_intake, carb_intake, total_cal, record_at) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING intake_id`,
            [userid, record_update.prot, record_update.fat, record_update.carb, record_update.total, date ]
        )
        const intake_id = InsertFoodRecord.rows[0].intake_id;
        if (current_intake >= daily_goal){
            await updateGoal(date.split(' ')[0], userid)
        }
        if (!InsertFoodRecord.rows[0]){
            throw new Error('intake id return fail'); 
        }
        return { message: 'successfully'}
    }catch(err){
        throw new Error(err.message);
    }
}
const updateGoal = async (date, userid) => {
    try{
        console.log("INNNN")
        const check_id = await pool.query(
            `SELECT id, is_achieve FROM daily_hist WHERE record_date = $1 AND userid = $2`,
            [date, userid]
        )
        if (!check_id.rows[0]) {
            await pool.query(
            `INSERT INTO daily_hist (userid, is_achieve, record_date)
            VALUES ($1, $2, $3)`,
            [userid, true, date]
            )
        }else {
            const daily_id = check_id.rows[0].id
            await pool.query(
                `UPDATE daily_hist SET is_achieve = true WHERE id =$1;`,
                [daily_id]
            )
        }
        return { message: 'insert data successfully'} // check it is undefine which mean nothing return
    }catch(err){
        throw new Error(err.message)
    }
}

module.exports = {insertData, updateGoal};