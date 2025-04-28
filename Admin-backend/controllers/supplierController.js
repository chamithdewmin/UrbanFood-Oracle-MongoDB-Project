const { initializeDB } = require('../db/dbConnection');
const oracledb = require('oracledb');

// Add a new supplier using PROCEDURE
async function createSupplier(req, res) {
  const { name, location } = req.body;

  if (!name || !location) {
    return res.status(400).json({ message: "Name and location are required." });
  }

  try {
    const connection = await initializeDB();
    await connection.execute(
      `BEGIN
         insert_supplier(:name, :location);
       END;`,
      { name, location },
      { autoCommit: true }
    );
    await connection.close();
    return res.status(201).json({ message: "Supplier added successfully via procedure." });
  } catch (error) {
    console.error('Error adding supplier:', error);
    return res.status(500).json({ message: "Error adding supplier.", error: error.message });
  }
}

// Get all suppliers (no procedure needed)
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

// Update supplier using PROCEDURE
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
      `BEGIN
         update_supplier(:id, :name, :location);
       END;`,
      { id: parseInt(id), name, location },
      { autoCommit: true }
    );
    await connection.close();
    return res.json({ message: "Supplier updated successfully via procedure." });
  } catch (error) {
    console.error('Error updating supplier:', error);
    return res.status(500).json({ message: "Error updating supplier.", error: error.message });
  }
}

// Delete supplier using PROCEDURE
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
      `BEGIN
         delete_supplier(:id);
       END;`,
      { id: parseInt(id) },
      { autoCommit: true }
    );
    await connection.close();
    return res.json({ message: "Supplier deleted successfully via procedure." });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    return res.status(500).json({ message: "Error deleting supplier.", error: error.message });
  }
}

module.exports = { createSupplier, getSuppliers, updateSupplier, deleteSupplier };
