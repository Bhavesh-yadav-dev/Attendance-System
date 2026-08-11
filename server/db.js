import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "bhavesh@yadav123",
  database: "attendance_system",
});

export default db;
