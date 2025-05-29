// src/firebase/seedProducts.ts
import { addProduct } from "./firestore";

export const defaultProducts = [
  {
    name: "Wireless Keyboard",
    description: "Slim wireless keyboard with quiet keys.",
    price: 29.99,
    stock: 40,
    imageUrl: "https://via.placeholder.com/300x200.png?text=Wireless+Keyboard",
    category: "Electronics"
  },
  {
    name: "Yoga Pants",
    description: "Comfortable stretch yoga pants for workouts.",
    price: 24.99,
    stock: 60,
    imageUrl: "https://via.placeholder.com/300x200.png?text=Yoga+Pants",
    category: "Clothing"
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable speaker with deep bass and long battery life.",
    price: 39.99,
    stock: 35,
    imageUrl: "https://via.placeholder.com/300x200.png?text=Bluetooth+Speaker",
    category: "Electronics"
  },
  {
    name: "Travel Mug",
    description: "Insulated mug keeps drinks hot or cold for hours.",
    price: 14.99,
    stock: 80,
    imageUrl: "https://via.placeholder.com/300x200.png?text=Travel+Mug",
    category: "Accessories"
  },
  {
    name: "Graphic Tee",
    description: "Trendy t-shirt with a cool graphic print.",
    price: 18.99,
    stock: 70,
    imageUrl: "https://via.placeholder.com/300x200.png?text=Graphic+Tee",
    category: "Clothing"
  },
  {
    name: "Laptop Sleeve",
    description: "Protective neoprene sleeve for 13-inch laptops.",
    price: 16.99,
    stock: 50,
    imageUrl: "https://via.placeholder.com/300x200.png?text=Laptop+Sleeve",
    category: "Accessories"
  },
  {
    name: "Running Shoes",
    description: "Lightweight shoes designed for runners.",
    price: 59.99,
    stock: 30,
    imageUrl: "https://via.placeholder.com/300x200.png?text=Running+Shoes",
    category: "Footwear"
  },
  {
    name: "Desk Organizer",
    description: "Keep your workspace tidy with this organizer.",
    price: 12.99,
    stock: 90,
    imageUrl: "https://via.placeholder.com/300x200.png?text=Desk+Organizer",
    category: "Office"
  },
  {
    name: "Beanie Hat",
    description: "Warm knit beanie for cold weather.",
    price: 11.99,
    stock: 55,
    imageUrl: "https://via.placeholder.com/300x200.png?text=Beanie+Hat",
    category: "Clothing"
  },
  {
    name: "Fitness Tracker",
    description: "Track your steps, sleep, and calories burned.",
    price: 44.99,
    stock: 25,
    imageUrl: "https://via.placeholder.com/300x200.png?text=Fitness+Tracker",
    category: "Electronics"
  },
  {
    name: "Sunglasses",
    description: "UV-protected sunglasses with polarized lenses.",
    price: 21.99,
    stock: 65,
    imageUrl: "https://via.placeholder.com/300x200.png?text=Sunglasses",
    category: "Accessories"
  },
  {
    name: "Notebook",
    description: "Hardcover notebook with lined pages.",
    price: 7.99,
    stock: 120,
    imageUrl: "https://via.placeholder.com/300x200.png?text=Notebook",
    category: "Office"
  },
  {
    name: "Rain Jacket",
    description: "Waterproof jacket for rainy days.",
    price: 49.99,
    stock: 20,
    imageUrl: "https://via.placeholder.com/300x200.png?text=Rain+Jacket",
    category: "Clothing"
  },
  {
    name: "Wireless Earbuds",
    description: "Compact earbuds with charging case.",
    price: 54.99,
    stock: 32,
    imageUrl: "https://via.placeholder.com/300x200.png?text=Wireless+Earbuds",
    category: "Electronics"
  },
  {
    name: "Leather Wallet",
    description: "Premium leather wallet with multiple compartments.",
    price: 24.99,
    stock: 40,
    imageUrl: "https://via.placeholder.com/300x200.png?text=Leather+Wallet",
    category: "Accessories"
  }
];

defaultProducts.forEach(product => addProduct(product));