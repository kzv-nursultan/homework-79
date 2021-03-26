const mysql = require('mysql2/promise');

let connection = null;

module.exports = {
    connect: async () => {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'user',
            password: 'user',
            database: 'test'
          });
    },
    getConnection: () =>  connection 
};