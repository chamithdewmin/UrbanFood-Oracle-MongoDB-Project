const oracledb = require('oracledb');

// Oracle DB connection configuration (DEFAULT user, not SYS)
const dbConfig = {
  user: 'System',          
  password: 'admin123',       
  connectString: 'localhost:1521/XE' 
};

// Connect to the Oracle DB
async function initializeDB() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    console.log('Connected to Oracle Database');
    return connection;
  } catch (error) {
    console.error('Error connecting to Oracle DB:', error);
    throw error;
  }
}

module.exports = { initializeDB };
