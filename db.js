const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',         // 数据库用户名
    host: 'localhost',        // 数据库地址
    database: 'users_db',     // 数据库名称
    port: 5432,               // PostgreSQL 默认端口
});

module.exports = pool;
