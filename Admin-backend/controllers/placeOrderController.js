const { initializeDB } = require('../db/dbConnection');
const oracledb = require('oracledb');

async function createOrderWithCustomer(req, res) {
  const { customer, items, total_amount } = req.body;
  let connection;

  try {
    connection = await initializeDB();

    // Insert Customer using Procedure and get Customer ID
    const customerResult = await connection.execute(
      `BEGIN
         insert_customer(:name, :email, :phone, :address);
         SELECT id INTO :id FROM customers WHERE email = :email;
       END;`,
      {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: false }
    );
    const customerId = customerResult.outBinds.id;

    // Insert Order using Procedure and get Order ID
    const orderResult = await connection.execute(
      `BEGIN
         insert_order(:customer_id, :total_amount, :status);
         SELECT id INTO :id FROM orders WHERE customer_id = :customer_id AND ROWNUM = 1 ORDER BY id DESC;
       END;`,
      {
        customer_id: customerId,
        total_amount,
        status: 'Pending',
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: false }
    );
    const orderId = orderResult.outBinds.id;

    // Insert each Order Item using Procedure
    for (const item of items) {
      await connection.execute(
        `BEGIN
           insert_order_item(:order_id, :product_id, :quantity, :price);
         END;`,
        {
          order_id: orderId,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price * item.quantity
        },
        { autoCommit: false }
      );
    }

    // Commit all changes
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
