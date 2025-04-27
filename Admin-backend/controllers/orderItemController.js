const { initializeDB } = require('../db/dbConnection');
const oracledb = require('oracledb');

// Get all Order Items
async function getOrderItems(req, res) {
  let connection;
  try {
    connection = await initializeDB();
    const result = await connection.execute(`SELECT * FROM order_items`, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to get order items", error });
  } finally {
    if (connection) await connection.close();
  }
}

// Create Order Item
async function createOrderItem(req, res) {
  const { order_id, product_id, quantity, price } = req.body;
  let connection;
  try {
    connection = await initializeDB();
    await connection.execute(
      `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (:order_id, :product_id, :quantity, :price)`,
      { order_id, product_id, quantity, price },
      { autoCommit: true }
    );
    res.status(201).json({ message: "Order item created" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create order item", error });
  } finally {
    if (connection) await connection.close();
  }
}

// Update Order Item
async function updateOrderItem(req, res) {
  const { id } = req.params;
  const { quantity, price } = req.body;
  let connection;
  try {
    connection = await initializeDB();
    await connection.execute(
      `UPDATE order_items SET quantity = :quantity, price = :price WHERE id = :id`,
      { quantity, price, id },
      { autoCommit: true }
    );
    res.json({ message: "Order item updated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order item", error });
  } finally {
    if (connection) await connection.close();
  }
}

// Delete Order Item
async function deleteOrderItem(req, res) {
  const { id } = req.params;
  let connection;
  try {
    connection = await initializeDB();
    await connection.execute(`DELETE FROM order_items WHERE id = :id`, [id], { autoCommit: true });
    res.json({ message: "Order item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order item", error });
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = { getOrderItems, createOrderItem, updateOrderItem, deleteOrderItem };
