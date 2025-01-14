const { Pool } = require('pg');
require('dotenv').config();
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const pool = new Pool({
    user: DB_USER,        
    host: DB_HOST,       
    database: 'users_db',     
    password: DB_PASSWORD,
    port: DB_PORT,               
});

module.exports = pool;
