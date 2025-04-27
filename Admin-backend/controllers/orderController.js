const { initializeDB } = require('../db/dbConnection');
const oracledb = require('oracledb');

// Create / Place Order
async function placeOrder(req, res) {
  const { customer_id, total_amount, items } = req.body;

  if (!customer_id || !total_amount || !items || items.length === 0) {
    return res.status(400).json({ message: "Invalid order data" });
  }

  let connection;

  try {
    connection = await initializeDB();
    await connection.execute('BEGIN');

    // 1. Insert into orders table
    const orderResult = await connection.execute(
      `INSERT INTO orders (customer_id, total_amount)
       VALUES (:customer_id, :total_amount)
       RETURNING id INTO :order_id`,
      {
        customer_id,
        total_amount,
        order_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: false }
    );

    const orderId = orderResult.outBinds.order_id[0];

    // 2. Insert into order_items table
    for (const item of items) {
      await connection.execute(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (:order_id, :product_id, :quantity, :price)`,
        {
          order_id: orderId,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        },
        { autoCommit: false }
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order', error });
  } finally {
    if (connection) await connection.close();
  }
}

// Get all Orders
async function getOrders(req, res) {
  try {
    const connection = await initializeDB();
    const result = await connection.execute(
      `SELECT o.id, o.order_date, o.total_amount, o.status, 
              c.name AS customer_name
       FROM orders o
       JOIN customers c ON o.customer_id = c.id`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json(result.rows);
    await connection.close();
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
}

// Get Single Order (Order Details)
async function getOrderById(req, res) {
  const { id } = req.params;

  try {
    const connection = await initializeDB();

    // Order details
    const orderResult = await connection.execute(
      `SELECT o.id, o.order_date, o.total_amount, o.status, 
              c.name AS customer_name
       FROM orders o
       JOIN customers c ON o.customer_id = c.id
       WHERE o.id = :id`,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Order Items
    const itemsResult = await connection.execute(
      `SELECT oi.id, p.name AS product_name, oi.quantity, oi.price
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = :id`,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const order = orderResult.rows[0];
    order.items = itemsResult.rows;

    res.status(200).json(order);
    await connection.close();
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order', error });
  }
}

// Update Order Status
async function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const connection = await initializeDB();
    const result = await connection.execute(
      `UPDATE orders SET status = :status WHERE id = :id`,
      { status, id },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated successfully" });
    await connection.close();
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status', error });
  }
}

// Delete Order
async function deleteOrder(req, res) {
  const { id } = req.params;

  let connection;

  try {
    connection = await initializeDB();
    await connection.execute('BEGIN');

    // Delete order items first
    await connection.execute(
      `DELETE FROM order_items WHERE order_id = :id`,
      [id],
      { autoCommit: false }
    );

    // Then delete the order
    const result = await connection.execute(
      `DELETE FROM orders WHERE id = :id`,
      [id],
      { autoCommit: false }
    );

    if (result.rowsAffected === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Order not found" });
    }

    await connection.commit();
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Error deleting order', error });
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = {
  placeOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
};
