import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./order.css";
import { AdminContext } from "../../context/AdminContext";
import Button from "@mui/material/Button";
import { TreeSelect } from "antd";
import parcelIcon from "../../assets/parcel_icon.png"; // ✅ Import the parcel icon correctly

const Order = () => {
  const { token } = useContext(AdminContext);
  const [orders, setOrders] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedOrders, setUpdatedOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  // Count items (temporary static - adjust logic later)
  const countItems = (orderId) => {
    return 1;
  };

  // Handle status change locally
  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setUpdatedOrders((prevUpdatedOrders) =>
      prevUpdatedOrders.filter((order) => order.orderId !== orderId).concat({
        orderId,
        status: newStatus,
      })
    );
  };

  // Handle update to backend
  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      for (let updatedOrder of updatedOrders) {
        await axios.put(
          `http://localhost:3000/api/orders/${updatedOrder.orderId}`,
          { status: updatedOrder.status },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      setUpdatedOrders([]);
      await fetchOrders(); // Refresh after updating
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete order
  const handleDeleteOrder = async (orderId) => {
    setIsUpdating(true);
    try {
      await axios.delete(`http://localhost:3000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="order">
      {isUpdating && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div className="order-header-container">
        <Button
          onClick={fetchOrders}
          disabled={loading}
          variant="outlined"
        >
          {loading ? "Loading…" : "Fetch Orders"}
        </Button>

        <Button
          onClick={handleUpdateStatus}
          variant="contained"
          color="primary"
          disabled={isUpdating || updatedOrders.length === 0}
          style={{ marginLeft: "10px" }}
        >
          Update Status
        </Button>
      </div>

      <div className="order-list">
        {orders.length === 0 ? (
          <div className="no-orders">No orders available</div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-item">
              <div className="order-header">
                <div className="order-image">
                  <img src={parcelIcon} alt="Package" /> {/* ✅ Correct usage */}
                </div>

                <div className="order-details">
                  <p className="order-items">{`Order ID: ${order.id}`}</p>
                  <p className="order-info">{`User ID: ${order.customer_id}`}</p>
                  <p className="order-info">{`Date: ${new Date(order.order_date).toLocaleString()}`}</p>
                </div>

                <div className="order-summary">
                  <p>Items: {countItems(order.id)}</p>
                  <p className="order-price">${order.total_amount}</p>
                </div>

                <div className="order-status">
                  <TreeSelect
                    value={order.status}
                    onChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                    treeData={[
                      { title: "Delivered", value: "Delivered" },
                      { title: "Pending", value: "Pending" },
                      { title: "Cancel", value: "Cancel" },
                    ]}
                    className="status-dropdown"
                    disabled={isUpdating}
                  />
                </div>

                <div className="order-delete">
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteOrder(order.id)}
                    disabled={isUpdating}
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
