const { initializeDB } = require('../db/dbConnection');
const oracledb = require('oracledb');

// Get all Order Items
async function getOrderItems(req, res) {
  let connection;
  try {
    connection = await initializeDB();
    const result = await connection.execute(
      `SELECT * FROM order_items`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching order items:', error);
    res.status(500).json({ message: "Failed to get order items", error });
  } finally {
    if (connection) await connection.close();
  }
}

// Create Order Item using PROCEDURE
async function createOrderItem(req, res) {
  const { order_id, product_id, quantity, price } = req.body;
  if (!order_id || !product_id || !quantity || !price) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  let connection;
  try {
    connection = await initializeDB();
    await connection.execute(
      `BEGIN
         insert_order_item(:order_id, :product_id, :quantity, :price);
       END;`,
      { order_id, product_id, quantity, price },
      { autoCommit: true }
    );
    res.status(201).json({ message: "Order item created via procedure" });
  } catch (error) {
    console.error('Error creating order item:', error);
    res.status(500).json({ message: "Failed to create order item", error });
  } finally {
    if (connection) await connection.close();
  }
}

// Update Order Item using PROCEDURE
async function updateOrderItem(req, res) {
  const { id } = req.params;
  const { quantity, price } = req.body;
  if (!id || quantity == null || price == null) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  let connection;
  try {
    connection = await initializeDB();
    await connection.execute(
      `BEGIN
         update_order_item(:id, :quantity, :price);
       END;`,
      { id, quantity, price },
      { autoCommit: true }
    );
    res.json({ message: "Order item updated via procedure" });
  } catch (error) {
    console.error('Error updating order item:', error);
    res.status(500).json({ message: "Failed to update order item", error });
  } finally {
    if (connection) await connection.close();
  }
}

// Delete Order Item using PROCEDURE
async function deleteOrderItem(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  let connection;
  try {
    connection = await initializeDB();
    await connection.execute(
      `BEGIN
         delete_order_item(:id);
       END;`,
      { id },
      { autoCommit: true }
    );
    res.json({ message: "Order item deleted via procedure" });
  } catch (error) {
    console.error('Error deleting order item:', error);
    res.status(500).json({ message: "Failed to delete order item", error });
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = { getOrderItems, createOrderItem, updateOrderItem, deleteOrderItem };
