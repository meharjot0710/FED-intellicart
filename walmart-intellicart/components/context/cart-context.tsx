"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  category: string
  quantity: number
  storeSection?: string
  addedBy?: string
  addedAt?: string
  claimedBy?: string
  status?: "pending" | "claimed" | "split"
}

interface CartState {
  personalItems: CartItem[]
  sharedItems: CartItem[]
  personalTotal: number
  sharedTotal: number
  totalItems: number
  totalPrice: number
}

type CartAction =
  | { type: "ADD_TO_PERSONAL"; payload: Omit<CartItem, "quantity"> }
  | { type: "ADD_TO_SHARED"; payload: Omit<CartItem, "quantity"> & { addedBy: string } }
  | { type: "REMOVE_FROM_PERSONAL"; payload: string }
  | { type: "REMOVE_FROM_SHARED"; payload: string }
  | { type: "UPDATE_PERSONAL_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "UPDATE_SHARED_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "MOVE_TO_SHARED"; payload: { id: string; addedBy: string } }
  | { type: "MOVE_TO_PERSONAL"; payload: string }
  | { type: "CLAIM_SHARED_ITEM"; payload: { id: string; claimedBy: string } }
  | { type: "SPLIT_SHARED_ITEM"; payload: string }
  | { type: "CLEAR_PERSONAL_CART" }
  | { type: "CLEAR_SHARED_CART" }
  | { type: "LOAD_CART"; payload: { personal: CartItem[]; shared: CartItem[] } }
  | { type: "SYNC_SHARED_ITEMS"; payload: CartItem[] }

const CartContext = createContext<{
  state: CartState
  addToPersonalCart: (item: Omit<CartItem, "quantity">) => void
  addToSharedCart: (item: Omit<CartItem, "quantity">, addedBy: string) => void
  removeFromPersonalCart: (id: string) => void
  removeFromSharedCart: (id: string) => void
  updatePersonalQuantity: (id: string, quantity: number) => void
  updateSharedQuantity: (id: string, quantity: number) => void
  moveToSharedCart: (id: string, addedBy: string) => void
  moveToPersonalCart: (id: string) => void
  claimSharedItem: (id: string, claimedBy: string) => void
  splitSharedItem: (id: string) => void
  clearPersonalCart: () => void
  clearSharedCart: () => void
  // Legacy support for existing components
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  items: CartItem[]
  personalItems: CartItem[]
  sharedItems: CartItem[]
  getSharedDiscounts: () => Array<{ item: string; discount: number; reason: string }>
} | null>(null)

// Mock household members
const householdMembers = [
  { id: "user1", name: "You", avatar: "👤", color: "bg-blue-100 text-blue-800" },
  { id: "user2", name: "Alex", avatar: "👨", color: "bg-green-100 text-green-800" },
  { id: "user3", name: "Sam", avatar: "👩", color: "bg-purple-100 text-purple-800" },
]

function cartReducer(state: CartState, action: CartAction): CartState {
  const calculateTotals = (personal: CartItem[], shared: CartItem[]) => {
    const personalTotal = personal.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const sharedTotal = shared.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const totalItems =
      personal.reduce((sum, item) => sum + item.quantity, 0) + shared.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = personalTotal + sharedTotal

    return { personalTotal, sharedTotal, totalItems, totalPrice }
  }

  switch (action.type) {
    case "ADD_TO_PERSONAL": {
      const existingItem = state.personalItems.find((item) => item.id === action.payload.id)

      let newPersonalItems
      if (existingItem) {
        newPersonalItems = state.personalItems.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        newPersonalItems = [...state.personalItems, { ...action.payload, quantity: 1 }]
      }

      const totals = calculateTotals(newPersonalItems, state.sharedItems)
      return { ...state, personalItems: newPersonalItems, ...totals }
    }

    case "ADD_TO_SHARED": {
      const existingItem = state.sharedItems.find((item) => item.id === action.payload.id)

      let newSharedItems
      if (existingItem) {
        newSharedItems = state.sharedItems.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        newSharedItems = [
          ...state.sharedItems,
          {
            ...action.payload,
            quantity: 1,
            addedBy: action.payload.addedBy,
            addedAt: new Date().toISOString(),
            status: "pending",
          },
        ]
      }

      const totals = calculateTotals(state.personalItems, newSharedItems)
      return { ...state, sharedItems: newSharedItems, ...totals }
    }

    case "REMOVE_FROM_PERSONAL": {
      const newPersonalItems = state.personalItems.filter((item) => item.id !== action.payload)
      const totals = calculateTotals(newPersonalItems, state.sharedItems)
      return { ...state, personalItems: newPersonalItems, ...totals }
    }

    case "REMOVE_FROM_SHARED": {
      const newSharedItems = state.sharedItems.filter((item) => item.id !== action.payload)
      const totals = calculateTotals(state.personalItems, newSharedItems)
      return { ...state, sharedItems: newSharedItems, ...totals }
    }

    case "UPDATE_PERSONAL_QUANTITY": {
      if (action.payload.quantity <= 0) {
        const newPersonalItems = state.personalItems.filter((item) => item.id !== action.payload.id)
        const totals = calculateTotals(newPersonalItems, state.sharedItems)
        return { ...state, personalItems: newPersonalItems, ...totals }
      }

      const newPersonalItems = state.personalItems.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
      )
      const totals = calculateTotals(newPersonalItems, state.sharedItems)
      return { ...state, personalItems: newPersonalItems, ...totals }
    }

    case "UPDATE_SHARED_QUANTITY": {
      if (action.payload.quantity <= 0) {
        const newSharedItems = state.sharedItems.filter((item) => item.id !== action.payload.id)
        const totals = calculateTotals(state.personalItems, newSharedItems)
        return { ...state, sharedItems: newSharedItems, ...totals }
      }

      const newSharedItems = state.sharedItems.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
      )
      const totals = calculateTotals(state.personalItems, newSharedItems)
      return { ...state, sharedItems: newSharedItems, ...totals }
    }

    case "MOVE_TO_SHARED": {
      const itemToMove = state.personalItems.find((item) => item.id === action.payload.id)
      if (!itemToMove) return state

      const newPersonalItems = state.personalItems.filter((item) => item.id !== action.payload.id)
      const newSharedItems = [
        ...state.sharedItems,
        {
          ...itemToMove,
          addedBy: action.payload.addedBy,
          addedAt: new Date().toISOString(),
          status: "pending" as const,
        },
      ]

      const totals = calculateTotals(newPersonalItems, newSharedItems)
      return { ...state, personalItems: newPersonalItems, sharedItems: newSharedItems, ...totals }
    }

    case "MOVE_TO_PERSONAL": {
      const itemToMove = state.sharedItems.find((item) => item.id === action.payload)
      if (!itemToMove) return state

      const newSharedItems = state.sharedItems.filter((item) => item.id !== action.payload)
      const { addedBy, addedAt, status, claimedBy, ...personalItem } = itemToMove
      const newPersonalItems = [...state.personalItems, personalItem]

      const totals = calculateTotals(newPersonalItems, newSharedItems)
      return { ...state, personalItems: newPersonalItems, sharedItems: newSharedItems, ...totals }
    }

    case "CLAIM_SHARED_ITEM": {
      const newSharedItems = state.sharedItems.map((item) =>
        item.id === action.payload.id
          ? { ...item, status: "claimed" as const, claimedBy: action.payload.claimedBy }
          : item,
      )
      const totals = calculateTotals(state.personalItems, newSharedItems)
      return { ...state, sharedItems: newSharedItems, ...totals }
    }

    case "SPLIT_SHARED_ITEM": {
      const newSharedItems = state.sharedItems.map((item) =>
        item.id === action.payload ? { ...item, status: "split" as const } : item,
      )
      const totals = calculateTotals(state.personalItems, newSharedItems)
      return { ...state, sharedItems: newSharedItems, ...totals }
    }

    case "CLEAR_PERSONAL_CART": {
      const totals = calculateTotals([], state.sharedItems)
      return { ...state, personalItems: [], ...totals }
    }

    case "CLEAR_SHARED_CART": {
      const totals = calculateTotals(state.personalItems, [])
      return { ...state, sharedItems: [], ...totals }
    }

    case "LOAD_CART": {
      const totals = calculateTotals(action.payload.personal, action.payload.shared)
      return {
        ...state,
        personalItems: action.payload.personal,
        sharedItems: action.payload.shared,
        ...totals,
      }
    }

    case "SYNC_SHARED_ITEMS": {
      const totals = calculateTotals(state.personalItems, action.payload)
      return { ...state, sharedItems: action.payload, ...totals }
    }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    personalItems: [],
    sharedItems: [],
    personalTotal: 0,
    sharedTotal: 0,
    totalItems: 0,
    totalPrice: 0,
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedPersonalCart = localStorage.getItem("walmart-personal-cart")
    const savedSharedCart = localStorage.getItem("walmart-shared-cart")

    try {
      const personalItems = savedPersonalCart ? JSON.parse(savedPersonalCart) : []
      const sharedItems = savedSharedCart
        ? JSON.parse(savedSharedCart)
        : [
            // Mock some shared items for demo
            {
              id: "shared-1",
              name: "Organic Milk",
              price: 4.99,
              image: "🥛",
              category: "Dairy",
              quantity: 2,
              storeSection: "Dairy",
              addedBy: "Alex",
              addedAt: new Date(Date.now() - 3600000).toISOString(),
              status: "pending",
            },
            {
              id: "shared-2",
              name: "Bread",
              price: 2.99,
              image: "🍞",
              category: "Bakery",
              quantity: 1,
              storeSection: "Bakery",
              addedBy: "Sam",
              addedAt: new Date(Date.now() - 1800000).toISOString(),
              status: "claimed",
              claimedBy: "You",
            },
          ]

      dispatch({ type: "LOAD_CART", payload: { personal: personalItems, shared: sharedItems } })
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
    }
  }, [])

  // Save carts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("walmart-personal-cart", JSON.stringify(state.personalItems))
  }, [state.personalItems])

  useEffect(() => {
    localStorage.setItem("walmart-shared-cart", JSON.stringify(state.sharedItems))
  }, [state.sharedItems])

  // Mock Firebase real-time sync for shared cart
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random shared cart updates from other household members
      if (Math.random() < 0.1) {
        // 10% chance every 5 seconds
        const mockUpdates = [
          {
            id: "shared-3",
            name: "Bananas",
            price: 2.48,
            image: "🍌",
            category: "Produce",
            quantity: 1,
            storeSection: "Produce",
            addedBy: "Alex",
            addedAt: new Date().toISOString(),
            status: "pending" as const,
          },
        ]

        // Only add if not already exists
        if (!state.sharedItems.find((item) => item.id === "shared-3")) {
          dispatch({ type: "SYNC_SHARED_ITEMS", payload: [...state.sharedItems, ...mockUpdates] })
          console.log("Analytics: Shared cart synced from household member")
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [state.sharedItems])

  // Calculate shared discounts based on pooled quantities
  const getSharedDiscounts = () => {
    const discounts: Array<{ item: string; discount: number; reason: string }> = []

    // Group items by name across all household members
    const itemCounts = state.sharedItems.reduce(
      (acc, item) => {
        acc[item.name] = (acc[item.name] || 0) + item.quantity
        return acc
      },
      {} as Record<string, number>,
    )

    // Apply bulk discounts
    Object.entries(itemCounts).forEach(([itemName, totalQuantity]) => {
      if (totalQuantity >= 2) {
        const discountPercent = Math.min(totalQuantity * 5, 20) // 5% per item, max 20%
        discounts.push({
          item: itemName,
          discount: discountPercent,
          reason: `${totalQuantity} items from household members`,
        })
      }
    })

    return discounts
  }

  const addToPersonalCart = (item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_TO_PERSONAL", payload: item })
  }

  const addToSharedCart = (item: Omit<CartItem, "quantity">, addedBy: string) => {
    dispatch({ type: "ADD_TO_SHARED", payload: { ...item, addedBy } })
  }

  const removeFromPersonalCart = (id: string) => {
    dispatch({ type: "REMOVE_FROM_PERSONAL", payload: id })
  }

  const removeFromSharedCart = (id: string) => {
    dispatch({ type: "REMOVE_FROM_SHARED", payload: id })
  }

  const updatePersonalQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_PERSONAL_QUANTITY", payload: { id, quantity } })
  }

  const updateSharedQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_SHARED_QUANTITY", payload: { id, quantity } })
  }

  const moveToSharedCart = (id: string, addedBy: string) => {
    dispatch({ type: "MOVE_TO_SHARED", payload: { id, addedBy } })
  }

  const moveToPersonalCart = (id: string) => {
    dispatch({ type: "MOVE_TO_PERSONAL", payload: id })
  }

  const claimSharedItem = (id: string, claimedBy: string) => {
    dispatch({ type: "CLAIM_SHARED_ITEM", payload: { id, claimedBy } })
  }

  const splitSharedItem = (id: string) => {
    dispatch({ type: "SPLIT_SHARED_ITEM", payload: id })
  }

  const clearPersonalCart = () => {
    dispatch({ type: "CLEAR_PERSONAL_CART" })
  }

  const clearSharedCart = () => {
    dispatch({ type: "CLEAR_SHARED_CART" })
  }

  // Legacy support for existing components
  const addItem = (item: Omit<CartItem, "quantity">) => {
    addToPersonalCart(item) // Default to personal cart
  }

  const removeItem = (id: string) => {
    // Try to remove from personal first, then shared
    const personalItem = state.personalItems.find((item) => item.id === id)
    if (personalItem) {
      removeFromPersonalCart(id)
    } else {
      removeFromSharedCart(id)
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    // Try to update personal first, then shared
    const personalItem = state.personalItems.find((item) => item.id === id)
    if (personalItem) {
      updatePersonalQuantity(id, quantity)
    } else {
      updateSharedQuantity(id, quantity)
    }
  }

  const clearCart = () => {
    clearPersonalCart()
    clearSharedCart()
  }

  return (
    <CartContext.Provider
      value={{
        state,
        addToPersonalCart,
        addToSharedCart,
        removeFromPersonalCart,
        removeFromSharedCart,
        updatePersonalQuantity,
        updateSharedQuantity,
        moveToSharedCart,
        moveToPersonalCart,
        claimSharedItem,
        splitSharedItem,
        clearPersonalCart,
        clearSharedCart,
        getSharedDiscounts,
        // Legacy support
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
        items: [...state.personalItems, ...state.sharedItems], // Combined for legacy support
        personalItems: state.personalItems,
        sharedItems: state.sharedItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
