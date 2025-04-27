import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});

  useEffect(() => {
    const fetchFoodList = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/products");
        setFoodList(response.data);
      } catch (error) {
        console.error("Error fetching food list:", error);
      }
    };
    fetchFoodList();
  }, []);

  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) {
        updated[itemId] -= 1;
      } else {
        delete updated[itemId];
      }
      return updated;
    });
  };

  const getTotalCartAmount = () => {
    let total = 0;
    for (const item of food_list) {
      if (cartItems[item.ID]) {
        total += item.PRICE * cartItems[item.ID];
      }
    }
    return total;
  };

  const getTotalQuantity = () => {
    return Object.values(cartItems).reduce((a, b) => a + b, 0);
  };

  return (
    <StoreContext.Provider
      value={{
        food_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getTotalQuantity,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
