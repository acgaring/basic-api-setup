const mysql = require("mysql2/promise"); //Promises are a JavaScript feature that allows you to work with asynchronous operations in a more readable and manageable way.

class Database {
  // encapsulate related properties and methods, group together functionalities to database operations
  constructor() {
    // method is a special method in a class that is automatically called when an instance of the class is created.

    this.conn = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      multipleStatements: false,
      connectionLimit: 10,
      waitForConnections: true,
      queueLimit: 0,
    }); // Initialize the connection
  }

  escape(value) {
    return this.conn.escape(value);
  }
  async query(sql, args) {
    let [rows, fields] = await this.conn.query(sql, args); //query function
    return rows;
  }

  async beginTransaction() {
    const conn = await this.conn.getConnection();
    await conn.beginTransaction();
    return conn;
  }
  async commit(conn) {
    await conn.commit();
    conn.release();
  }
  async rollback(conn) {
    await conn.rollback();
    conn.release();
  }
}
module.exports = Database;
