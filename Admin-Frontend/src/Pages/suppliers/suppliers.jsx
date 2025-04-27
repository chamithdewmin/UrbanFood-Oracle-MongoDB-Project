import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import "./suppliers.css";
import { AdminContext } from "../../context/AdminContext";

const AddSupplier = () => {
  const { token } = useContext(AdminContext);

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [supplierId, setSupplierId] = useState("");

  const [data, setData] = useState({
    name: "",
    location: "",
  });

  const [suppliers, setSuppliers] = useState([]);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/suppliers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuppliers(response.data); // store suppliers in state
    } catch (error) {
      console.error("Error fetching suppliers", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setData({ name: "", location: "" });
    setSupplierId("");
    setIsUpdateMode(false);
    fetchSuppliers(); // refresh table after add/update/delete
  };

  const showAlertMessage = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (isUpdateMode) {
        if (!supplierId) {
          showAlertMessage("error", "Please provide a Supplier ID to update.");
          return;
        }
        await axios.put(`http://localhost:3000/api/suppliers/${supplierId}`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        showAlertMessage("success", "Supplier updated successfully!");
      } else {
        await axios.post("http://localhost:3000/api/suppliers", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        showAlertMessage("success", "Supplier added successfully!");
      }
      resetForm();
    } catch (error) {
      console.error(error.response?.data || error.message);
      showAlertMessage("error", error.response?.data?.message || "Failed to add/update supplier.");
    }
  };

  const onDeleteHandler = async () => {
    if (!supplierId) {
      showAlertMessage("error", "Please provide a Supplier ID to delete.");
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/suppliers/${supplierId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showAlertMessage("success", "Supplier deleted successfully!");
      resetForm();
    } catch (error) {
      console.error(error.response?.data || error.message);
      showAlertMessage("error", error.response?.data?.message || "Failed to delete supplier.");
    }
  };

  return (
    <div className="add-supplier-page">
      {/* Left Side Form */}
      <div className="add">
        {showAlert && (
          <div className={`alert-box ${alertType} slide-in`}>
            <div className="alert-content">
              <span>{alertMessage}</span>
            </div>
            <div className="progress-bar"></div>
          </div>
        )}

        <form className="flex-col" onSubmit={onSubmitHandler}>
          <div className="checkbox-update">
            <input
              type="checkbox"
              id="update-mode"
              checked={isUpdateMode}
              onChange={(e) => setIsUpdateMode(e.target.checked)}
            />
            <label htmlFor="update-mode">Update/Delete Existing Supplier</label>
          </div>

          {isUpdateMode && (
            <div className="add-product-id flex-col">
              <p>Supplier ID</p>
              <input
                type="text"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                placeholder="Enter Supplier ID"
                required
              />
            </div>
          )}

          <div className="add-product-name flex-col">
            <p>Supplier Name</p>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={onChangeHandler}
              placeholder="Enter supplier name"
              required
            />
          </div>

          <div className="add-product-discription flex-col">
            <p>Supplier Location</p>
            <input
              type="text"
              name="location"
              value={data.location}
              onChange={onChangeHandler}
              placeholder="Enter supplier location"
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className={isUpdateMode ? "update-btn" : "add-btn"}>
              {isUpdateMode ? "✔️ Update Supplier" : "➕ Add Supplier"}
            </button>

            {isUpdateMode && (
              <button
                type="button"
                className="update-btn"
                onClick={onDeleteHandler}
                style={{ backgroundColor: "#dc3545" }}
              >
                ❌ Delete Supplier
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Right Side Table */}
      <div className="stable-container">
        <h3>All Suppliers</h3>
        <table className="stable-container">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.ID || supplier.id}>
                <td>{supplier.ID || supplier.id}</td>
                <td>{supplier.NAME || supplier.name}</td>
                <td>{supplier.LOCATION || supplier.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddSupplier;
