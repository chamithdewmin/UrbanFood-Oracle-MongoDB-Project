import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    getTotalQuantity,
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal > 3000 ? 0 : 2;
  const total = subtotal + deliveryFee;

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title cart-heading">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {Object.keys(cartItems).length === 0 ? (
          <p className="NoItems">No Items in cart</p>
        ) : (
          food_list.map((item) => {
            if (cartItems[item.ID] > 0) {
              return (
                <React.Fragment key={item.ID}>
                  <div className="cart-items-title cart-items-item">
                    <img src={item.IMAGE} alt={item.NAME} />
                    <p>{item.NAME}</p>
                    <p>${item.PRICE.toFixed(2)}</p>
                    <p>{cartItems[item.ID]}</p>
                    <p>${(item.PRICE * cartItems[item.ID]).toFixed(2)}</p>
                    <p
                      className="Remove"
                      onClick={() => removeFromCart(item.ID)}
                    >
                      <img src={assets.remove_icon_cross} alt="remove" />
                    </p>
                  </div>
                  <hr />
                </React.Fragment>
              );
            }
            return null;
          })
        )}
      </div>

      {/* Bottom Section */}
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${total.toFixed(2)}</b>
            </div>
          </div>
          <button
            disabled={subtotal === 0}
            onClick={() => navigate("/order")}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
