import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

export const deliveryFee = 2;

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    getTotalQuantity,
  } = useContext(StoreContext);

  const totalQuantity = getTotalQuantity();
  const navigate = useNavigate();

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
        {totalQuantity === 0 ? (
          <p className="NoItems">No Items in cart</p>
        ) : (
          food_list.map((item, index) => {
            if (cartItems[item.ID] > 0) {
              return (
                <React.Fragment key={item.ID}>
                  <div className="cart-items-title cart-items-item">
                    <img src={item.IMAGE} alt="food" />
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
                  <hr key={`hr-${item.ID}-${index}`} />
                </React.Fragment>
              );
            }
            return null;
          })
        )}
      </div>

      {/* BOTTOM PART */}
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount().toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : deliveryFee.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                $
                {getTotalCartAmount() === 0
                  ? 0
                  : (getTotalCartAmount() + deliveryFee).toFixed(2)}
              </b>
            </div>
          </div>
          <button
            disabled={getTotalCartAmount() === 0}
            onClick={() => navigate("/order")}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>

        {/* PROMO CODE AREA */}
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Promo Code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
