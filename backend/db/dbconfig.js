// db/dbConfig.js

const oracledb = require("oracledb");

// ✅ Database Connection Configuration
const dbConfig = {
  user: "HR",      // <-- Replace with your username
  password: "admin123",  // <-- Replace with your password
  connectString: "localhost/XE"   // <-- Change if needed
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
