import React, { useContext, useState } from "react";
import axios from "axios";
import "./add.css";
import { assets } from "../../assets/assets.js";
import { AdminContext } from "../../context/AdminContext";

const Add = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    category: "",
    price: "",
    supplier_id: "", // ⭐ must add this
  });
  const { token } = useContext(AdminContext);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("price", data.price);
    formData.append("supplier_id", data.supplier_id);
    formData.append("image", image); // ⭐ must match backend "image"

    try {
      await axios.post("http://localhost:3000/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // if you are using tokens
        },
      });
      setAlertType("success");
      setAlertMessage("Item added successfully!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);

      setData({
        name: "",
        category: "",
        price: "",
        supplier_id: "",
      });
      setImage(null);
    } catch (error) {
      setAlertType("error");
      setAlertMessage("Failed to add product.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="add">
      {showAlert && (
        <div className={`alert-box ${alertType} slide-in`}>
          <div className="alert-content">
            <img
              src={
                alertType === "success"
                  ? assets.success_icon
                  : assets.error_icon
              }
              alt={alertType}
            />
            <span>{alertMessage}</span>
          </div>
          <div className="progress-bar"></div>
        </div>
      )}
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Name"
            required
          />
        </div>

        <div className="add-product-discription flex-col">
          <p>Product Description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.category}
            name="category"
            rows="6"
            placeholder="Category (example: Pizza, Burger, etc.)"
            required
          ></textarea>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Supplier ID</p>
            <input
              onChange={onChangeHandler}
              value={data.supplier_id}
              type="text"
              name="supplier_id"
              placeholder="Supplier ID"
              required
            />
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="Price"
              required
            />
          </div>
        </div>

        <button type="submit" className="add-btn">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Add;
