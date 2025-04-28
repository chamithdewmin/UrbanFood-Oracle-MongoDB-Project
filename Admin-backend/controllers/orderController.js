const { initializeDB } = require('../db/dbConnection');
const oracledb = require('oracledb');

// Fetch all orders
async function getAllOrders(req, res) {
  let connection;
  try {
    connection = await initializeDB();
    const result = await connection.execute(
      `SELECT id, customer_id, order_date, total_amount, status FROM orders`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error });
  } finally {
    if (connection) await connection.close();
  }
}

// Create a new order using PROCEDURE
async function createOrder(req, res) {
  const { customer_id, total_amount, status } = req.body;

  if (!customer_id || !total_amount) {
    return res.status(400).json({ message: "Customer ID and total amount are required" });
  }

  let connection;
  try {
    connection = await initializeDB();
    await connection.execute(
      `BEGIN 
         insert_order(:customer_id, :total_amount, :status); 
       END;`,
      {
        customer_id,
        total_amount,
        status: status || null,
      },
      { autoCommit: true }
    );
    res.status(201).json({ message: 'Order created successfully.' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error });
  } finally {
    if (connection) await connection.close();
  }
}

// Delete an order using PROCEDURE
async function deleteOrder(req, res) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  let connection;
  try {
    connection = await initializeDB();
    await connection.execute(
      `BEGIN 
         delete_order(:id); 
       END;`,
      { id: Number(id) },
      { autoCommit: true }
    );
    res.json({ message: 'Order deleted successfully.' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Failed to delete order', error });
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = { getAllOrders, createOrder, deleteOrder };
