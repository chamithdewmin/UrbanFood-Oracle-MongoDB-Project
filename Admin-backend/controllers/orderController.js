const { initializeDB } = require('../db/dbConnection');

// Function to place an order (POST)
async function placeOrder(req, res) {
  const { customer_id, total_amount, status } = req.body;
  let connection;

  try {
    connection = await initializeDB();
    await connection.execute(
      `INSERT INTO orders (customer_id, total_amount, status) VALUES (:customer_id, :total_amount, :status)`,
      [customer_id, total_amount, status],
      { autoCommit: true }
    );
    res.status(201).json({ message: 'Order placed successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error });

  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// Function to get all orders (GET)
async function getOrders(req, res) {
  let connection;

  try {
    connection = await initializeDB();
    const result = await connection.execute('SELECT * FROM orders');
    res.status(200).json(result.rows);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });

  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// Function to get a single order by ID (GET)
async function getOrderById(req, res) {
  const { id } = req.params;
  let connection;

  try {
    connection = await initializeDB();
    const result = await connection.execute(
      'SELECT * FROM orders WHERE id = :id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });

  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// Function to update order status (PUT)
async function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  let connection;

  try {
    connection = await initializeDB();

    // Check if order exists
    const checkOrder = await connection.execute(
      'SELECT * FROM orders WHERE id = :id',
      [id]
    );
    if (checkOrder.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await connection.execute(
      `UPDATE orders SET status = :status WHERE id = :id`,
      [status, id],
      { autoCommit: true }
    );

    res.json({ message: 'Order status updated successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error });

  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// Function to delete an order (DELETE)
async function deleteOrder(req, res) {
  const { id } = req.params;
  let connection;

  try {
    connection = await initializeDB();

    // Check if order exists
    const checkOrder = await connection.execute(
      'SELECT * FROM orders WHERE id = :id',
      [id]
    );
    if (checkOrder.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await connection.execute(
      `DELETE FROM orders WHERE id = :id`,
      [id],
      { autoCommit: true }
    );

    res.json({ message: 'Order deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });

  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

module.exports = { 
  placeOrder, 
  getOrders, 
  getOrderById,   // 🆕
  updateOrderStatus, 
  deleteOrder 
};
