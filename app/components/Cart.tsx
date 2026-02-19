'use client'

import { useRouter } from 'next/navigation'
import { CartItem } from '../types'

interface CartProps {
  items: CartItem[]
  isOpen: boolean
  onClose: () => void
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
}

export default function Cart({ items, isOpen, onClose, onUpdateQuantity, onRemoveItem }: CartProps) {
  const router = useRouter()

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  const handleCheckout = () => {
    if (items.length > 0) {
      // Store cart in sessionStorage for checkout page
      sessionStorage.setItem('cart', JSON.stringify(items))
      router.push('/checkout')
      onClose()
    }
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold text-white">Your Quote</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16 mx-auto text-gray-600 mb-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
                <p className="text-gray-400">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{item.product.name}</h3>
                        <p className="text-sm text-gray-400">{item.product.itemCode}</p>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                        aria-label="Remove item"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white transition-colors"
                        >
                          -
                        </button>
                        <span className="w-12 text-center text-white font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-white transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gold">
                          ${(item.product.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          ${item.product.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-800 p-6 space-y-4">
              <div className="flex items-center justify-between text-lg">
                <span className="text-gray-400">Subtotal:</span>
                <span className="text-2xl font-bold text-gold">
                  ${subtotal.toLocaleString()}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-gold hover:bg-yellow-600 text-navy font-semibold py-4 rounded-lg transition-colors duration-200"
              >
                Request Quote
              </button>
              <p className="text-xs text-gray-400 text-center">
                Final pricing will be confirmed after review
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
