const { initializeDB } = require('../db/dbConnection');
const oracledb = require('oracledb');

async function createOrderWithCustomer(req, res) {
  const { customer, items, total_amount } = req.body;
  let connection;

  try {
    connection = await initializeDB();

    // Insert Customer using procedure
    await connection.execute(
      `BEGIN
         insert_customer(:name, :email, :phone, :address);
       END;`,
      {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      },
      { autoCommit: false }
    );

    // Get the Customer ID
    const resultCustomer = await connection.execute(
      `SELECT id FROM customers WHERE email = :email ORDER BY id DESC FETCH FIRST 1 ROWS ONLY`,
      { email: customer.email },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const customerId = resultCustomer.rows[0]?.ID;

    if (!customerId) {
      throw new Error('Failed to fetch customer ID');
    }

    // Insert Order
    await connection.execute(
      `BEGIN
         insert_order(:customer_id, :total_amount, :status);
       END;`,
      {
        customer_id: customerId,
        total_amount: total_amount,
        status: 'Pending',
      },
      { autoCommit: false }
    );

    // Get the Order ID
    const resultOrder = await connection.execute(
      `SELECT id FROM orders WHERE customer_id = :customer_id ORDER BY id DESC FETCH FIRST 1 ROWS ONLY`,
      { customer_id: customerId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const orderId = resultOrder.rows[0]?.ID;

    if (!orderId) {
      throw new Error('Failed to fetch order ID');
    }

    // Insert Order Items
    for (const item of items) {
      await connection.execute(
        `BEGIN
           insert_order_item(:order_id, :product_id, :quantity, :price);
         END;`,
        {
          order_id: orderId,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price * item.quantity,
        },
        { autoCommit: false }
      );
    }

    // Commit
    await connection.commit();

    res.status(201).json({ message: "Order created successfully", orderId });

  } catch (error) {
    console.error('Error creating order:', error);
    if (connection) await connection.rollback();
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = { createOrderWithCustomer };
