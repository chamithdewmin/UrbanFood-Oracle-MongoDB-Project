import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./PlaceOrder.css";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { cartItems, food_list, getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const prepareOrderData = () => {
    const items = [];
    for (const id in cartItems) {
      if (cartItems[id] > 0) {
        const product = food_list.find(p => p.ID === parseInt(id));
        if (product) {
          items.push({
            product_id: product.ID,
            quantity: cartItems[id],
            price: product.PRICE,
          });
        }
      }
    }
    return items;
  };

  const handleProceedToPayment = async () => {
    setMessage({ type: "", text: "" });
    setLoading(true);

    if (!userInfo.name || !userInfo.email || !userInfo.address || !userInfo.phone) {
      setLoading(false);
      setMessage({ type: "error", text: "Please fill in all fields!" });
      return;
    }

    const items = prepareOrderData();

    if (items.length === 0) {
      setLoading(false);
      setMessage({ type: "error", text: "No items in cart!" });
      return;
    }

    const totalAmount = getTotalCartAmount() + (getTotalCartAmount() > 3000 ? 0 : 2);

    const payload = {
      customer: { ...userInfo },
      items,
      total_amount: totalAmount,
    };

    try {
      const response = await fetch('http://localhost:3000/api/create-order', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setOrderId(data.orderId);
        setMessage({ type: "success", text: "Order placed successfully!" });
        setStep(2);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to create order" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error: " + error.message });
    }
    setLoading(false);
  };

  const handleConfirmAndPay = async () => {
    setMessage({ type: "", text: "" });
    setLoading(true);

    if (!orderId) {
      setLoading(false);
      setMessage({ type: "error", text: "Order ID not found!" });
      return;
    }

    const totalAmount = getTotalCartAmount() + (getTotalCartAmount() > 3000 ? 0 : 2);

    try {
      const response = await fetch('http://localhost:3000/api/payments', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          amount: totalAmount,
          status: "Pending",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Payment successful!" });
        setTimeout(() => navigate("/order-success"), 1500);
      } else {
        setMessage({ type: "error", text: data.message || "Payment failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error: " + error.message });
    }
    setLoading(false);
  };

  return (
    <div className="place-order">
      <div className="place-order-left">
        <h2 className="title">{step === 1 ? "Delivery Information" : "Payment Details"}</h2>

        {message.text && (
          <div className={message.type === "error" ? "error-message" : "success-message"}>
            {message.text}
          </div>
        )}

        {step === 1 ? (
          <>
            <input type="text" name="name" placeholder="Full Name" value={userInfo.name} onChange={handleInputChange} />
            <input type="email" name="email" placeholder="Email Address" value={userInfo.email} onChange={handleInputChange} />
            <input type="text" name="address" placeholder="Address" value={userInfo.address} onChange={handleInputChange} />
            <input type="text" name="phone" placeholder="Phone Number" value={userInfo.phone} onChange={handleInputChange} />
          </>
        ) : (
          <div className="payment-info">
            <p>💳 Payment Method: <strong>Cash on Delivery</strong></p>
            <p>🧾 Invoice will be sent to: <strong>{userInfo.email}</strong></p>
          </div>
        )}
      </div>

      <div className="place-order-right">
        <div className="checkout-section">
          <h2>Order Summary</h2>
          <h3>Subtotal: ${getTotalCartAmount().toFixed(2)}</h3>
          <h3>Delivery Fee: ${getTotalCartAmount() > 3000 ? 0 : 2}</h3>
          <h2>Total: ${(getTotalCartAmount() + (getTotalCartAmount() > 3000 ? 0 : 2)).toFixed(2)}</h2>

          {step === 1 ? (
            <button onClick={handleProceedToPayment} className="confirm-button" disabled={loading}>
              {loading ? "Processing..." : "Proceed to Payment"}
            </button>
          ) : (
            <button onClick={handleConfirmAndPay} className="confirm-button" disabled={loading}>
              {loading ? "Paying..." : "Confirm & Pay"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
