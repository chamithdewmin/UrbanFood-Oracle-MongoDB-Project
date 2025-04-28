import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./order.css";
import { AdminContext } from "../../context/AdminContext";
import Button from "@mui/material/Button";
import { TreeSelect } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import parcelIcon from "../../assets/parcel_icon.png";

const Order = () => {
  const { token } = useContext(AdminContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all orders
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:3000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/api/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order status updated!");
      await fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status!");
    }
  };

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:3000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order deleted successfully!");
      await fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order!");
    }
  };

  return (
    <div className="order">
      <ToastContainer position="top-right" autoClose={3000} />

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div className="order-header-container">
        <Button onClick={fetchOrders} variant="outlined">
          {loading ? "Loading…" : "Refresh Orders"}
        </Button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="order-list">
        {orders.length === 0 ? (
          <div className="no-orders">No orders available</div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-item">
              <div className="order-header">
                <div className="order-image">
                  <img src={parcelIcon} alt="Package" />
                </div>

                <div className="order-details">
                  <p><b>Order ID:</b> <span>{order.id}</span></p>
                  <p><b>Customer ID:</b> <span>{order.customer_id}</span></p>
                  <p><b>Order Date:</b> <span>{new Date(order.order_date).toLocaleString()}</span></p>
                </div>

                <div className="order-summary">
                  <p><b>Total:</b> <span>${order.total_amount}</span></p>
                </div>

                <div className="order-status">
                  <TreeSelect
                    value={order.status}
                    onChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                    treeData={[
                      { title: "Pending", value: "Pending" },
                      { title: "Delivered", value: "Delivered" },
                      { title: "Cancel", value: "Cancel" },
                    ]}
                    className="status-dropdown"
                    style={{ width: 150 }}
                    dropdownStyle={{ zIndex: 9999 }}
                  />
                </div>

                <div className="order-delete">
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Order;
