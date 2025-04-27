const { initializeDB } = require('../db/dbConnection');
const oracledb = require('oracledb');

// Add a new supplier
async function createSupplier(req, res) {
  const { name, location } = req.body;

  if (!name || !location) {
    return res.status(400).json({ message: "Name and location are required." });
  }

  try {
    const connection = await initializeDB();
    await connection.execute(
      `INSERT INTO suppliers (name, location) VALUES (:name, :location)`,
      { name, location },
      { autoCommit: true }
    );
    await connection.close();
    return res.status(201).json({ message: "Supplier added successfully." });
  } catch (error) {
    console.error('Error adding supplier:', error);
    return res.status(500).json({ message: "Error adding supplier.", error: error.message });
  }
}

// Get all suppliers
async function getSuppliers(req, res) {
  try {
    const connection = await initializeDB();
    const result = await connection.execute(
      `SELECT * FROM suppliers`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await connection.close();
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return res.status(500).json({ message: "Error fetching suppliers.", error: error.message });
  }
}

// Update a supplier
async function updateSupplier(req, res) {
  const { id } = req.params;
  const { name, location } = req.body;

  if (!name || !location) {
    return res.status(400).json({ message: "Name and location are required." });
  }

  try {
    const connection = await initializeDB();

    const result = await connection.execute(
      `SELECT id FROM suppliers WHERE id = :id`,
      { id: parseInt(id) }
    );

    if (result.rows.length === 0) {
      await connection.close();
      return res.status(404).json({ message: "Supplier not found." });
    }

    await connection.execute(
      `UPDATE suppliers SET name = :name, location = :location WHERE id = :id`,
      { name, location, id: parseInt(id) },
      { autoCommit: true }
    );
    await connection.close();
    return res.json({ message: "Supplier updated successfully." });
  } catch (error) {
    console.error('Error updating supplier:', error);
    return res.status(500).json({ message: "Error updating supplier.", error: error.message });
  }
}

// Delete a supplier
async function deleteSupplier(req, res) {
  const { id } = req.params;

  try {
    const connection = await initializeDB();

    const result = await connection.execute(
      `SELECT id FROM suppliers WHERE id = :id`,
      { id: parseInt(id) }
    );

    if (result.rows.length === 0) {
      await connection.close();
      return res.status(404).json({ message: "Supplier not found." });
    }

    await connection.execute(
      `DELETE FROM suppliers WHERE id = :id`,
      { id: parseInt(id) },
      { autoCommit: true }
    );
    await connection.close();
    return res.json({ message: "Supplier deleted successfully." });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    return res.status(500).json({ message: "Error deleting supplier.", error: error.message });
  }
}

module.exports = { createSupplier, getSuppliers, updateSupplier, deleteSupplier };
