const { initializeDB } = require('../db/dbConnection');

// Fetch all orders
async function getAllOrders(req, res) {
  let connection;
  try {
    connection = await initializeDB();
    const result = await connection.execute(`SELECT * FROM orders`);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// Create a new order
async function createOrder(req, res) {
  // your create logic if needed (keep empty if not needed)
  res.status(501).json({ message: "Create order not implemented." });
}

// Delete an order
async function deleteOrder(req, res) {
  const { id } = req.params;
  let connection;

  try {
    connection = await initializeDB();
    const result = await connection.execute(
      `DELETE FROM orders WHERE id = :id`,
      [id],
      { autoCommit: true }
    );

    if (result.rowsAffected && result.rowsAffected > 0) {
      res.json({ message: 'Order deleted successfully' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }

  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Failed to delete order', error });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

module.exports = { getAllOrders, createOrder, deleteOrder };
