const { initializeDB } = require('../db/dbConnection');
const oracledb = require('oracledb');

// Get all Payments
async function getPayments(req, res) {
  let connection;
  try {
    connection = await initializeDB();
    const result = await connection.execute(
      `SELECT * FROM payments`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: "Failed to get payments", error });
  } finally {
    if (connection) await connection.close();
  }
}

// Create Payment using PROCEDURE
async function createPayment(req, res) {
  const { order_id, amount, status } = req.body;
  if (!order_id || !amount) {
    return res.status(400).json({ message: "Order ID and Amount are required" });
  }

  let connection;
  try {
    connection = await initializeDB();
    await connection.execute(
      `BEGIN
         insert_payment(:order_id, :amount, :status);
       END;`,
      { order_id, amount, status: status || null },
      { autoCommit: true }
    );
    res.status(201).json({ message: "Payment created via procedure" });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: "Failed to create payment", error });
  } finally {
    if (connection) await connection.close();
  }
}

// Update Payment using PROCEDURE
async function updatePayment(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  if (!id || !status) {
    return res.status(400).json({ message: "ID and Status are required" });
  }

  let connection;
  try {
    connection = await initializeDB();
    await connection.execute(
      `BEGIN
         update_payment(:id, :status);
       END;`,
      { id, status },
      { autoCommit: true }
    );
    res.json({ message: "Payment status updated via procedure" });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ message: "Failed to update payment", error });
  } finally {
    if (connection) await connection.close();
  }
}

// Delete Payment using PROCEDURE
async function deletePayment(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  let connection;
  try {
    connection = await initializeDB();
    await connection.execute(
      `BEGIN
         delete_payment(:id);
       END;`,
      { id },
      { autoCommit: true }
    );
    res.json({ message: "Payment deleted via procedure" });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ message: "Failed to delete payment", error });
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = { getPayments, createPayment, updatePayment, deletePayment };
