import React, { useContext } from "react";
import "./FoodItem.css";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img src={image} alt={name} className="food-item-img" />
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price.toFixed(2)}</p>

        <div className="food-item-action">
          {!cartItems[id] ? (
            <button className="add-to-cart-btn" onClick={() => addToCart(id)}>
              Add to Cart
            </button>
          ) : (
            <div className="food-item-counter">
              <button className="counter-btn" onClick={() => removeFromCart(id)}>-</button>
              <p>{cartItems[id]}</p>
              <button className="counter-btn" onClick={() => addToCart(id)}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
