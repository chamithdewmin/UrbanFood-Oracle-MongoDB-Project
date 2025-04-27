import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./PlaceOrder.css";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { cartItems, food_list, getTotalCartAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleProceedToCheckout = async () => {
    // Prepare data
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
      alert("No items in cart!");
      return;
    }

    const orderData = {
      customer_id: 1, // ➡️ hardcoded now, later get from logged-in user
      total_amount: getTotalCartAmount(),
      items: orderItems,
    };

    try {
      const response = await fetch('http://localhost:3000/api/orders', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Order placed successfully!");
        navigate("/order-success"); // ➡️ Redirect to success page if you have
      } else {
        alert("Failed to place order: " + data.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="place-order">
      {/* ... your form here ... */}
      <div className="checkout-section">
        <h2>Total: ${getTotalCartAmount()}</h2>
        <button onClick={handleProceedToCheckout} className="checkout-button">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default PlaceOrder;
