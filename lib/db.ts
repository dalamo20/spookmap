// For use with MySQL in dev only
import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: process.env.MYSQL_HOST as string,
    user: process.env.MYSQL_USER as string,
    password: process.env.MYSQL_PASSWORD as string,
    database: process.env.MYSQL_DATABASE as string,
});

export default db;
