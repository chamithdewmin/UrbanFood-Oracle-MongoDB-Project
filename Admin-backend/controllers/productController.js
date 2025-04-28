const { initializeDB } = require('../db/dbConnection');
const oracledb = require('oracledb');

// Get all products
async function getProducts(req, res) {
  try {
    const connection = await initializeDB();
    const result = await connection.execute(
      `SELECT * FROM products`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await connection.close();
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
}

// Create a new product using PROCEDURE
async function createProduct(req, res) {
  const { name, category, price, supplier_id } = req.body;

  if (!name || !price || !supplier_id) {
    return res.status(400).json({ message: 'Name, price, and supplier_id are required.' });
  }

  try {
    const connection = await initializeDB();
    await connection.execute(
      `BEGIN
         insert_product(:name, :category, :price, :supplier_id);
       END;`,
      {
        name,
        category: category || null,
        price: parseFloat(price),
        supplier_id: parseInt(supplier_id)
      },
      { autoCommit: true }
    );
    await connection.close();
    return res.status(201).json({ message: 'Product created successfully via procedure.' });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({ message: error.message || 'Error creating product.' });
  }
}

// Update a product using PROCEDURE
async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, category, price, supplier_id } = req.body;

  if (!name || !price || !supplier_id) {
    return res.status(400).json({ message: 'Name, price, and supplier_id are required.' });
  }

  try {
    const connection = await initializeDB();

    const result = await connection.execute(
      `SELECT id FROM products WHERE id = :id`,
      { id: parseInt(id) }
    );

    if (result.rows.length === 0) {
      await connection.close();
      return res.status(404).json({ message: 'Product not found.' });
    }

    await connection.execute(
      `BEGIN
         update_product(:id, :name, :category, :price, :supplier_id);
       END;`,
      {
        id: parseInt(id),
        name,
        category: category || null,
        price: parseFloat(price),
        supplier_id: parseInt(supplier_id)
      },
      { autoCommit: true }
    );

    await connection.close();
    return res.json({ message: 'Product updated successfully via procedure.' });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: error.message || 'Error updating product.' });
  }
}

// Delete a product using PROCEDURE
async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    const connection = await initializeDB();

    const result = await connection.execute(
      `SELECT id FROM products WHERE id = :id`,
      { id: parseInt(id) }
    );

    if (result.rows.length === 0) {
      await connection.close();
      return res.status(404).json({ message: 'Product not found.' });
    }

    await connection.execute(
      `BEGIN
         delete_product(:id);
       END;`,
      { id: parseInt(id) },
      { autoCommit: true }
    );
    await connection.close();
    return res.json({ message: 'Product deleted successfully via procedure.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: error.message || 'Error deleting product.' });
  }
}

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
