const oracledb = require("oracledb");

const dbConfig = {
  user: 'URBANFOOD',          // ✅ your created user
  password: 'urban123',        // ✅ your user password
  connectString: 'localhost:1521/XEPDB1' // ✅ connection string to database
};

async function getConnection() {
  try {
    return await oracledb.getConnection(dbConfig);
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

module.exports = { getConnection };
