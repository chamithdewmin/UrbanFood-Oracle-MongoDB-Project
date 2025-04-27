import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});

  // Fetch product list from backend
  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/products"); // update if different URL
        setFoodList(response.data);
      } catch (error) {
        console.error("Error fetching food list:", error);
      }
    };
    fetchFoodList();
  }, []);

  // Add to cart
  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  // Remove from cart
  const removeFromCart = (itemId, removeAll = false) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (removeAll || updated[itemId] <= 1) {
        delete updated[itemId];
      } else {
        updated[itemId] -= 1;
      }
      return updated;
    });
  };

  // Get total cart amount
  const getTotalCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const product = food_list.find((item) => item.ID === parseInt(id));
      if (product) {
        total += product.PRICE * cartItems[id];
      }
    }
    return total;
  };

  // Get total quantity
  const getTotalQuantity = () => {
    return Object.values(cartItems).reduce((acc, val) => acc + val, 0);
  };

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalQuantity,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
