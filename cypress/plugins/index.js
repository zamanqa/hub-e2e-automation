const mysql = require('mysql2/promise');
require('dotenv').config();

module.exports = (on, config) => {
  // Database tasks
  on('task', {
    async queryDatabase(query) {
      const connection = await mysql.createConnection({
        host: config.env.db_host,
        user: config.env.db_user,
        password: config.env.db_password,
        database: config.env.db_name
      });
      
      const [rows] = await connection.execute(query.sql, query.params || []);
      await connection.end();
      return rows;
    },
    
    async executeQuery(query) {
      const connection = await mysql.createConnection({
        host: config.env.db_host,
        user: config.env.db_user,
        password: config.env.db_password,
        database: config.env.db_name
      });
      
      const [result] = await connection.execute(query.sql, query.params || []);
      await connection.end();
      return result;
    }
  });

  return config;
};
