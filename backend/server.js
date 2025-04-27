const express = require('express');
const cors = require('cors');
const oracledb = require('oracledb');
const dbConfig = require('./db/dbconfig'); // path to your db config

const app = express();
app.use(cors());
app.use(express.json()); // to accept JSON in body

// Get all products
app.get('/api/products', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`SELECT * FROM products`);
    const products = result.rows.map(row => ({
      product_id: row[0],
      name: row[1],
      description: row[2],
      price: row[3],
      image_url: row[4],
      category: row[5],
      supplier_id: row[6]
    }));
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  } finally {
    if (connection) await connection.close();
  }
});

// Insert new product
app.post('/api/products', async (req, res) => {
  const { product_id, name, description, price, image_url, category, supplier_id } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `INSERT INTO products (product_id, name, description, price, image_url, category, supplier_id) 
       VALUES (:product_id, :name, :description, :price, :image_url, :category, :supplier_id)`,
      { product_id, name, description, price, image_url, category, supplier_id },
      { autoCommit: true }
    );
    res.json({ message: "Product inserted successfully" });
  } catch (error) {
    console.error("Error inserting product:", error);
    res.status(500).json({ error: "Failed to insert product" });
  } finally {
    if (connection) await connection.close();
  }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url, category, supplier_id } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `UPDATE products 
       SET name = :name, description = :description, price = :price, image_url = :image_url, category = :category, supplier_id = :supplier_id 
       WHERE product_id = :id`,
      { name, description, price, image_url, category, supplier_id, id },
      { autoCommit: true }
    );
    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  } finally {
    if (connection) await connection.close();
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(
      `DELETE FROM products WHERE product_id = :id`,
      { id },
      { autoCommit: true }
    );
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  } finally {
    if (connection) await connection.close();
  }
});

// Server start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
