import { createContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type { Order } from "../types/order";
import type { CartItem } from "../types/cart";
import type { Address } from "../types/address";

interface OrderContextValue {
  orders: Order[];
  placeOrder: (
    items: CartItem[],
    total: number,
    shippingAddress: Address,
  ) => void;
  cancelOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  requestReturn: (orderId: string, reason: string) => void;
  approveReturn: (orderId: string) => void;
  rejectReturn: (orderId: string) => void;
  deleteOrder: (orderId: string) => void;
  clearOrders: () => void;
}

type Action =
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "CANCEL_ORDER"; payload: string }
  | {
      type: "UPDATE_STATUS";
      payload: { orderId: string; status: Order["status"] };
    }
  | { type: "REQUEST_RETURN"; payload: { orderId: string; reason: string } }
  | { type: "APPROVE_RETURN"; payload: string }
  | { type: "REJECT_RETURN"; payload: string }
  | { type: "DELETE_ORDER"; payload: string }
  | { type: "CLEAR" };

function orderReducer(state: Order[], action: Action): Order[] {
  switch (action.type) {
    case "ADD_ORDER":
      return [action.payload, ...state];

    case "CANCEL_ORDER":
      return state.map((o) =>
        o.id === action.payload ? { ...o, status: "cancelled" } : o,
      );

    case "UPDATE_STATUS":
      return state.map((o) =>
        o.id === action.payload.orderId
          ? { ...o, status: action.payload.status }
          : o,
      );

    case "REQUEST_RETURN":
      return state.map((o) =>
        o.id === action.payload.orderId
          ? {
              ...o,
              status: "return_requested",
              returnReason: action.payload.reason,
            }
          : o,
      );

    case "APPROVE_RETURN":
      return state.map((o) =>
        o.id === action.payload ? { ...o, status: "returned" } : o,
      );

    case "REJECT_RETURN":
      return state.map((o) =>
        o.id === action.payload ? { ...o, status: "delivered" } : o,
      );

    case "DELETE_ORDER":
      return state.filter((o) => o.id !== action.payload);

    case "CLEAR":
      return [];

    default:
      return state;
  }
}

const STORAGE_KEY = "sneaker-store-orders";

function loadInitialOrders(): Order[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export const OrderContext = createContext<OrderContextValue | undefined>(
  undefined,
);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, dispatch] = useReducer(orderReducer, [], loadInitialOrders);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (
    items: CartItem[],
    total: number,
    shippingAddress: Address,
  ) => {
    const orderItems = items.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      brand: item.product.brand,
      image: item.selectedImage,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: item.product.discountPrice ?? item.product.price,
    }));

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items: orderItems,
      total,
      placedAt: new Date().toISOString(),
      status: "confirmed",
      shippingAddress,
    };

    dispatch({ type: "ADD_ORDER", payload: newOrder });
  };

  const cancelOrder = (orderId: string) => {
    dispatch({ type: "CANCEL_ORDER", payload: orderId });
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    dispatch({ type: "UPDATE_STATUS", payload: { orderId, status } });
  };

  const requestReturn = (orderId: string, reason: string) => {
    dispatch({ type: "REQUEST_RETURN", payload: { orderId, reason } });
  };

  const approveReturn = (orderId: string) => {
    dispatch({ type: "APPROVE_RETURN", payload: orderId });
  };

  const rejectReturn = (orderId: string) => {
    dispatch({ type: "REJECT_RETURN", payload: orderId });
  };

  const deleteOrder = (orderId: string) => {
    dispatch({ type: "DELETE_ORDER", payload: orderId });
  };

  const clearOrders = () => dispatch({ type: "CLEAR" });

  return (
    <OrderContext.Provider
      value={{ orders,
        placeOrder,
        cancelOrder,
        updateOrderStatus,
        requestReturn,
        approveReturn,
        rejectReturn,
        deleteOrder,
        clearOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}
