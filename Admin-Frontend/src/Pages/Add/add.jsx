import React, { useContext, useState } from "react";
import axios from "axios";
import "./add.css";
import { AdminContext } from "../../context/AdminContext";

const Add = () => {
  const { token } = useContext(AdminContext);

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [productId, setProductId] = useState("");

  const [data, setData] = useState({
    name: "",
    category: "",
    price: "",
    supplier_id: "",
  });

  const categories = [
    "Salad", "Rolls", "Deserts", "Sandwich",
    "Cake", "Pure Veg", "Pasta", "Noodles"
  ];

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setData({
      name: "",
      category: "",
      price: "",
      supplier_id: "",
    });
    setProductId("");
    setIsUpdateMode(false);
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
        if (!productId) {
          showAlertMessage("error", "Please provide a Product ID to update.");
          return;
        }
        await axios.put(`http://localhost:3000/api/products/${productId}`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        showAlertMessage("success", "Product updated successfully!");
      } else {
        await axios.post("http://localhost:3000/api/products", data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        showAlertMessage("success", "Product added successfully!");
      }

      resetForm();
    } catch (error) {
      console.error(error.response?.data || error.message);
      showAlertMessage("error", error.response?.data?.message || "Failed to add/update product.");
    }
  };

  return (
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
          <label htmlFor="update-mode">Update Existing Product</label>
        </div>

        {isUpdateMode && (
          <div className="add-product-id flex-col">
            <p>Product ID</p>
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Enter Product ID"
              required
            />
          </div>
        )}

        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={onChangeHandler}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="add-product-discription flex-col">
          <p>Product Category</p>
          <select
            name="category"
            value={data.category}
            onChange={onChangeHandler}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Supplier ID</p>
            <input
              type="number"
              name="supplier_id"
              value={data.supplier_id}
              onChange={onChangeHandler}
              placeholder="Supplier ID"
              required
            />
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              type="number"
              name="price"
              value={data.price}
              onChange={onChangeHandler}
              placeholder="Price"
              required
            />
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className={isUpdateMode ? "update-btn" : "add-btn"}>
            {isUpdateMode ? "✔️ Update Product" : "➕ Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;
