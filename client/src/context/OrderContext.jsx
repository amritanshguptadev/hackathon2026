import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const OrderContext = createContext();
const STORAGE_KEY = "buykaro_orders";

const INITIAL_DEMO_ORDERS = [
  {
    orderId: "BK-849201",
    status: "Meetup Scheduled",
    items: [
      {
        _id: "bk-item-1",
        id: "bk-item-1",
        title: "HP ProBook 15.6\" Student Laptop (Core i5 / 8GB / 256GB SSD)",
        price: 13999,
        quantity: 1,
        image: "/images/products/1.jpg",
        condition: "Good",
        category: "Electronics",
        seller: {
          name: "Arjun Verma",
          college: "IIT Delhi",
          email: "arjun.verma@iitd.ac.in",
        },
      },
    ],
    total: 13999,
    subtotal: 13999,
    discount: 0,
    meetupLocation: "Central Library - Ground Floor Entrance",
    preferredTime: "Today (4:00 PM – 6:00 PM)",
    paymentMethod: "Cash on Hand-off",
    buyerNotes: "I will meet near the library revolving door.",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    meetupCode: "BK-7749",
  },
  {
    orderId: "BK-632190",
    status: "Hand-off Completed",
    items: [
      {
        _id: "bk-item-4",
        id: "bk-item-4",
        title: "Humanities & Social Sciences Core Textbook Stack",
        price: 599,
        quantity: 1,
        image: "/images/products/4.jpg",
        condition: "Good",
        category: "Books & Notes",
        seller: {
          name: "Meera Sen",
          college: "Delhi University",
          email: "meera.sen@du.ac.in",
        },
      },
      {
        _id: "bk-item-12",
        id: "bk-item-12",
        title: "4-Socket Heavy-Duty Power Strip Extension Board (3m Cord)",
        price: 250,
        quantity: 1,
        image: "/images/products/12.jpg",
        condition: "Good",
        category: "Hostel Essentials",
        seller: {
          name: "Rajat Chauhan",
          college: "IIT Roorkee",
          email: "rajat.chauhan@iitr.ac.in",
        },
      },
    ],
    total: 849,
    subtotal: 849,
    discount: 0,
    meetupLocation: "Hostel Gate 2 / Guard Cabin",
    preferredTime: "Yesterday (12:00 PM – 2:00 PM)",
    paymentMethod: "UPI on Hand-off",
    buyerNotes: "Thanks for the quick meetup!",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    meetupCode: "BK-2108",
  },
];

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      return INITIAL_DEMO_ORDERS;
    } catch {
      return INITIAL_DEMO_ORDERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error("Error saving orders to localStorage:", e);
    }
  }, [orders]);

  const addOrder = (newOrder) => {
    const orderWithDetails = {
      ...newOrder,
      status: newOrder.status || "Meetup Scheduled",
      meetupCode: newOrder.meetupCode || `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: newOrder.createdAt || new Date().toISOString(),
    };

    setOrders((prev) => [orderWithDetails, ...prev]);
    return orderWithDetails;
  };

  const cancelOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.orderId === orderId ? { ...ord, status: "Cancelled" } : ord
      )
    );
    toast.info(`Order #${orderId} has been cancelled.`);
  };

  const completeOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.orderId === orderId ? { ...ord, status: "Hand-off Completed" } : ord
      )
    );
    toast.success(`🎉 Hand-off for Order #${orderId} marked as completed!`);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        orderCount: orders.length,
        addOrder,
        cancelOrder,
        completeOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    return {
      orders: [],
      orderCount: 0,
      addOrder: () => {},
      cancelOrder: () => {},
      completeOrder: () => {},
    };
  }
  return context;
}

export default OrderContext;
