const { initializeDB } = require('../db/dbConnection');
const oracledb = require('oracledb');

// Get all Payments
async function getPayments(req, res) {
  let connection;
  try {
    connection = await initializeDB();
    const result = await connection.execute(`SELECT * FROM payments`, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to get payments", error });
  } finally {
    if (connection) await connection.close();
  }
}

// Create Payment
async function createPayment(req, res) {
  const { order_id, amount, status } = req.body;
  let connection;
  try {
    connection = await initializeDB();
    await connection.execute(
      `INSERT INTO payments (order_id, amount, status) VALUES (:order_id, :amount, :status)`,
      { order_id, amount, status },
      { autoCommit: true }
    );
    res.status(201).json({ message: "Payment created" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create payment", error });
  } finally {
    if (connection) await connection.close();
  }
}

// Update Payment
async function updatePayment(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  let connection;
  try {
    connection = await initializeDB();
    await connection.execute(
      `UPDATE payments SET status = :status WHERE id = :id`,
      { status, id },
      { autoCommit: true }
    );
    res.json({ message: "Payment status updated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update payment", error });
  } finally {
    if (connection) await connection.close();
  }
}

// Delete Payment
async function deletePayment(req, res) {
  const { id } = req.params;
  let connection;
  try {
    connection = await initializeDB();
    await connection.execute(`DELETE FROM payments WHERE id = :id`, [id], { autoCommit: true });
    res.json({ message: "Payment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete payment", error });
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = { getPayments, createPayment, updatePayment, deletePayment };
