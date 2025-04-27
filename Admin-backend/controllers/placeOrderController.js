const { initializeDB } = require('../db/dbConnection');
const oracledb = require('oracledb');

async function createOrderWithCustomer(req, res) {
  const { customer, items, total_amount } = req.body;
  let connection;

  try {
    connection = await initializeDB();

    // Insert Customer
    const customerResult = await connection.execute(
      `INSERT INTO customers (name, email, phone, address)
       VALUES (:name, :email, :phone, :address)
       RETURNING id INTO :id`,
      {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      }
    );
    const customerId = customerResult.outBinds.id[0];

    // Insert Order
    const orderResult = await connection.execute(
      `INSERT INTO orders (customer_id, total_amount, status)
       VALUES (:customer_id, :total_amount, 'Pending')
       RETURNING id INTO :id`,
      {
        customer_id: customerId,
        total_amount,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      }
    );
    const orderId = orderResult.outBinds.id[0];

    // Insert Order Items
    for (const item of items) {
      await connection.execute(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (:order_id, :product_id, :quantity, :price)`,
        {
          order_id: orderId,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price * item.quantity
        }
      );
    }

    await connection.commit();
    res.status(201).json({ message: "Order created successfully", orderId: orderId });

  } catch (error) {
    console.error('Error creating order:', error);
    if (connection) await connection.rollback();
    res.status(500).json({ message: 'Failed to create order', error });
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = { createOrderWithCustomer };
