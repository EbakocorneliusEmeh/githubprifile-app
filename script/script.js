import React, { createContext, useContext, useState, useEffect } from 'react';

const FoodContext = createContext();

export const FoodProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);

 
  useEffect(() => {
    const storedFoods = localStorage.getItem('foods');
    const storedCart = localStorage.getItem('cart');
    const dummyFoods = [
      { id: 1, name: 'Burger', description: 'Tasty beef burger', calories: 500, price: 8 },
      { id: 2, name: 'Pizza', description: 'Cheesy pepperoni pizza', calories: 700, price: 12 },
    ];
    setFoods(storedFoods ? JSON.parse(storedFoods) : dummyFoods);
    setCart(storedCart ? JSON.parse(storedCart) : []);
  }, []);

  
  useEffect(() => {
    localStorage.setItem('foods', JSON.stringify(foods));
  }, [foods]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (food) => setCart([...cart, food]);
  const clearCart = () => setCart([]);

  const deleteFood = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this food item?');
    if (confirmDelete) {
      setFoods(foods.filter(f => f.id !== id));
    }
  };

  return (
    <FoodContext.Provider value={{ foods, setFoods, cart, addToCart, clearCart, deleteFood, setCart }}>
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = () => useContext(FoodContext);
