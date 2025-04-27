import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./PlaceOrder.css";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { cartItems, food_list, getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    name: "",    // Full Name (matches database)
    email: "",
    address: "",
    phone: "",
  });

  const [step, setStep] = useState(1);
  const [orderId, setOrderId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleProceedToPayment = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    if (!userInfo.name || !userInfo.email || !userInfo.address || !userInfo.phone) {
      setLoading(false);
      setErrorMessage("Please fill in all fields!");
      return;
    }

    const orderItems = [];

    for (const id in cartItems) {
      if (cartItems[id] > 0) {
        const product = food_list.find((item) => item.ID === parseInt(id));
        if (product) {
          orderItems.push({
            product_id: product.ID,
            quantity: cartItems[id],
            price: product.PRICE,
          });
        }
      }
    }

    if (orderItems.length === 0) {
      setLoading(false);
      setErrorMessage("No items in cart!");
      return;
    }

    const totalAmount = getTotalCartAmount() + (getTotalCartAmount() > 3000 ? 0 : 2);

    const orderData = {
      customer: {
        name: userInfo.name,
        email: userInfo.email,
        address: userInfo.address,
        phone: userInfo.phone,
      },
      items: orderItems,
      total_amount: totalAmount
    };

    try {
      const response = await fetch('http://localhost:3000/api/create-order', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Customer and Order created successfully!");
        setOrderId(data.orderId);
        setStep(2);
      } else {
        setErrorMessage("Failed to create order: " + data.message);
      }
    } catch (error) {
      setErrorMessage("Error creating order: " + error.message);
    }
    setLoading(false);
  };

  const handleConfirmAndPay = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    if (!orderId) {
      setLoading(false);
      setErrorMessage("Order not created properly!");
      return;
    }

    const totalAmount = getTotalCartAmount() + (getTotalCartAmount() > 3000 ? 0 : 2);

    const paymentData = {
      order_id: orderId,
      amount: totalAmount,
      status: "Pending"
    };

    try {
      const response = await fetch('http://localhost:3000/api/payments', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Payment successful!");
        setTimeout(() => {
          navigate("/order-success");
        }, 1500);
      } else {
        setErrorMessage("Failed to make payment: " + data.message);
      }
    } catch (error) {
      setErrorMessage("Error making payment: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="place-order">
      <div className="place-order-left">
        <h2 className="title">{step === 1 ? "Delivery Information" : "Payment Details"}</h2>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        {step === 1 ? (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={userInfo.name}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={userInfo.email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Street Address"
              value={userInfo.address}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={userInfo.phone}
              onChange={handleInputChange}
            />
          </>
        ) : (
          <div className="payment-info">
            <p>💳 Payment Method: <strong>Cash on Delivery</strong></p>
            <p>🧾 Invoice will be sent to your email: {userInfo.email}</p>
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
            <button 
              onClick={handleProceedToPayment} 
              className="confirm-button" 
              disabled={loading}
            >
              {loading ? "Proceeding..." : "Proceed to Payment"}
            </button>
          ) : (
            <button 
              onClick={handleConfirmAndPay} 
              className="confirm-button"
              disabled={loading}
            >
              {loading ? "Paying..." : "Confirm & Pay"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
