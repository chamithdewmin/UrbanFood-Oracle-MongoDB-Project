const { initializeDB } = require('../db/dbConnection');

// Get all customers
async function getCustomers(req, res) {
  let connection;
  try {
    connection = await initializeDB();
    const result = await connection.execute(
      'SELECT * FROM customers',
      [],
      { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching customers', error });
  } finally {
    if (connection) await connection.close();
  }
}

// Create a new customer
async function createCustomer(req, res) {
  const { name, email, phone, address } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  let connection;
  try {
    connection = await initializeDB();
    const result = await connection.execute(
      `INSERT INTO customers (name, email, phone, address) 
       VALUES (:name, :email, :phone, :address)
       RETURNING id INTO :id`,
      {
        name,
        email,
        phone,
        address,
        id: { dir: require('oracledb').BIND_OUT, type: require('oracledb').NUMBER }
      },
      { autoCommit: true }
    );

    res.status(201).json({
      message: 'Customer created successfully',
      customerId: result.outBinds.id[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating customer', error });
  } finally {
    if (connection) await connection.close();
  }
}

// Update a customer
async function updateCustomer(req, res) {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  let connection;
  try {
    connection = await initializeDB();

    const checkCustomer = await connection.execute(
      'SELECT id FROM customers WHERE id = :id',
      [id]
    );

    if (checkCustomer.rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const result = await connection.execute(
      `UPDATE customers 
       SET name = :name, email = :email, phone = :phone, address = :address
       WHERE id = :id`,
      { name, email, phone, address, id },
      { autoCommit: true }
    );

    res.json({ message: 'Customer updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating customer', error });
  } finally {
    if (connection) await connection.close();
  }
}

// Delete a customer
async function deleteCustomer(req, res) {
  const { id } = req.params;

  let connection;
  try {
    connection = await initializeDB();

    const checkCustomer = await connection.execute(
      'SELECT id FROM customers WHERE id = :id',
      [id]
    );

    if (checkCustomer.rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await connection.execute(
      'DELETE FROM customers WHERE id = :id',
      [id],
      { autoCommit: true }
    );

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting customer', error });
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = { getCustomers, createCustomer, updateCustomer, deleteCustomer };
