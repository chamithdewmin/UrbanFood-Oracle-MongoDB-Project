const express = require("express");
const cors = require("cors");
const { getConnection } = require("./db/dbconfig"); // ⭐ Import from db folder

const app = express();
app.use(cors());
app.use(express.json());

// API: Get all products
app.get("/api/products", async (req, res) => {
  let connection;

  try {
    // ⭐ Use imported getConnection function
    connection = await getConnection();

    const result = await connection.execute(
      `SELECT product_id, name, description, price, image_url, category FROM products`
    );

    const products = result.rows.map((row) => ({
      id: row[0],
      name: row[1],
      description: row[2],
      price: row[3],
      image: row[4],
      category: row[5],
    }));

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
