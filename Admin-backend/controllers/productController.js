const { initializeDB } = require('../db/dbConnection');
const oracledb = require('oracledb');

// Function to get all products
async function getProducts(req, res) {
  try {
    const connection = await initializeDB();
    const result = await connection.execute(
      'SELECT * FROM products',
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT } // ⭐ important
    );

    const products = result.rows.map(product => {
      if (product.IMAGE) {
        const imageBase64 = product.IMAGE.toString('base64');
        product.IMAGE = `data:image/jpeg;base64,${imageBase64}`;
      }
      return product;
    });

    res.status(200).json(products);
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
}

// Function to create a new product
async function createProduct(req, res) {
  const { name, category, price, supplier_id } = req.body;
  const image = req.file;

  if (!name || !price || !supplier_id || !image) {
    return res.status(400).json({ message: 'Name, price, supplier_id, and image are required' });
  }

  try {
    const connection = await initializeDB();
    const result = await connection.execute(
      `INSERT INTO products (name, category, price, supplier_id, image) 
      VALUES (:name, :category, :price, :supplier_id, :image)`,
      [name, category, price, supplier_id, image.buffer],
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(500).json({ message: 'Error creating product' });
    }

    res.status(201).json({ message: 'Product created successfully' });
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
}

// Function to update a product
async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, category, price, supplier_id } = req.body;
  const image = req.file;

  if (!name || !price || !supplier_id) {
    return res.status(400).json({ message: 'Name, price, and supplier_id are required' });
  }

  try {
    const connection = await initializeDB();
    const checkProduct = await connection.execute('SELECT * FROM products WHERE id = :id', [id]);

    if (checkProduct.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const query = image ?
      `UPDATE products SET name = :name, category = :category, price = :price, supplier_id = :supplier_id, image = :image WHERE id = :id`
      : `UPDATE products SET name = :name, category = :category, price = :price, supplier_id = :supplier_id WHERE id = :id`;

    const params = image ? [name, category, price, supplier_id, image.buffer, id] : [name, category, price, supplier_id, id];

    const result = await connection.execute(query, params, { autoCommit: true });

    if (result.rowsAffected === 0) {
      return res.status(500).json({ message: 'Error updating product' });
    }

    res.json({ message: 'Product updated successfully' });
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
}

// Function to delete a product
async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    const connection = await initializeDB();
    const checkProduct = await connection.execute('SELECT * FROM products WHERE id = :id', [id]);

    if (checkProduct.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const result = await connection.execute(
      `DELETE FROM products WHERE id = :id`,
      [id],
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(500).json({ message: 'Error deleting product' });
    }

    res.json({ message: 'Product deleted successfully' });
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
}

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
