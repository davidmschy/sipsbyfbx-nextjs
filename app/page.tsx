'use client'

import { useState } from 'react'
import { submitOrder, type OrderPayload } from '@/lib/api'

interface Product {
  item_code: string
  name: string
  price: number
  description: string
  specs: { label: string; value: string }[]
}

interface CartItem extends Product {
  quantity: number
}

const PRODUCTS: Product[] = [
  {
    item_code: 'SIPS-WALL-4X24',
    name: 'SIP Wall Panel 4"x8\'x24\'',
    price: 1250,
    description: '4-inch EPS foam core with OSB facing. Superior insulation and structural integrity for exterior walls.',
    specs: [
      { label: 'R-Value', value: 'R-15' },
      { label: 'Size', value: '4"x8\'x24\'' },
      { label: 'Load Bearing', value: '2,400 PSF' },
    ],
  },
  {
    item_code: 'SIPS-ROOF-4X24',
    name: 'SIP Roof Panel 4"x8\'x24\'',
    price: 1450,
    description: 'Heavy-duty roof panels with enhanced load capacity. Perfect for flat and low-slope roofing applications.',
    specs: [
      { label: 'R-Value', value: 'R-20' },
      { label: 'Size', value: '4"x8\'x24\'' },
      { label: 'Load', value: '40 PSF live' },
    ],
  },
  {
    item_code: 'SIPS-SPLINE-LINEAR-FT',
    name: 'SIP Spline Connector (per linear ft)',
    price: 5,
    description: 'OSB spline connectors for seamless panel-to-panel joining. Sold per linear foot.',
    specs: [
      { label: 'Fits', value: '4" panels' },
      { label: 'Material', value: 'Structural OSB' },
      { label: 'Min Order', value: '10 ft' },
    ],
  },
]

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
]

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [showCheckout, setShowCheckout] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    projectName: '',
    address1: '',
    address2: '',
    city: '',
    state: 'CA',
    zip: '',
  })

  const handleQuantityChange = (itemCode: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemCode]: Math.max(1, (prev[itemCode] || 1) + delta),
    }))
  }

  const addToCart = (product: Product) => {
    const qty = quantities[product.item_code] || 1
    setCart((prev) => {
      const existing = prev.find((item) => item.item_code === product.item_code)
      if (existing) {
        return prev.map((item) =>
          item.item_code === product.item_code
            ? { ...item, quantity: item.quantity + qty }
            : item
        )
      }
      return [...prev, { ...product, quantity: qty }]
    })
    setQuantities((prev) => ({ ...prev, [product.item_code]: 1 }))
    setShowCart(true)
  }

  const removeFromCart = (itemCode: string) => {
    setCart((prev) => prev.filter((item) => item.item_code !== itemCode))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setOrderError(null)

    try {
      const payload: OrderPayload = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        shipping: {
          address1: formData.address1,
          address2: formData.address2 || undefined,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: 'United States',
        },
        items: cart.map((item) => ({
          item_code: item.item_code,
          qty: item.quantity,
          rate: item.price,
        })),
        projectName: formData.projectName,
      }

      const result = await submitOrder(payload)
      setOrderSuccess(result.orderId || result.name || 'Success')
      setCart([])
      setShowCheckout(false)
      setShowCart(false)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        projectName: '',
        address1: '',
        address2: '',
        city: '',
        state: 'CA',
        zip: '',
      })
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : 'Failed to submit order')
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-navy text-white py-4 px-6 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">SIPs by FBX</h1>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-navy text-white py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">Build Better. Build Faster.</h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Structural Insulated Panels engineered for modern construction
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-4xl font-bold text-amber-500 mb-2">57% Less</div>
              <div className="text-gray-300">vs stick frame</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-4xl font-bold text-amber-500 mb-2">R-40+</div>
              <div className="text-gray-300">insulation</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-4xl font-bold text-amber-500 mb-2">50-100yr</div>
              <div className="text-gray-300">lifespan</div>
            </div>
          </div>

          <button
            onClick={scrollToProducts}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
          >
            Shop Panels
          </button>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Our Products</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Premium structural insulated panels for residential and commercial construction
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {PRODUCTS.map((product) => (
              <div key={product.item_code} className="card">
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <span className="text-gray-500 font-semibold">{product.name}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-3xl font-bold text-blue-700 mb-4">
                    ${product.price.toLocaleString()}
                    {product.item_code === 'SIPS-SPLINE-LINEAR-FT' ? '/ft' : '/panel'}
                  </p>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  
                  <div className="mb-4 space-y-2">
                    {product.specs.map((spec, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="font-semibold text-gray-700">{spec.label}:</span>
                        <span className="text-gray-600">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <button
                      onClick={() => handleQuantityChange(product.item_code, -1)}
                      className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold">
                      {quantities[product.item_code] || 1}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(product.item_code, 1)}
                      className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="w-full btn-primary"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowCart(false)}>
          <div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Your Cart</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.item_code} className="border-b pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-gray-600">
                              ${item.price} x {item.quantity}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.item_code)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-right font-bold text-blue-700">
                          ${(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-blue-700">${cartTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowCart(false)
                      setShowCheckout(true)
                    }}
                    className="w-full btn-secondary"
                  >
                    Proceed to Checkout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto" onClick={() => setShowCheckout(false)}>
          <div
            className="min-h-screen px-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl my-8">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">Checkout</h3>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    &times;
                  </button>
                </div>
              </div>

              <form onSubmit={handleCheckout} className="p-6">
                {/* Customer Info */}
                <div className="mb-6">
                  <h4 className="font-bold text-lg mb-4">Customer Information</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                </div>

                {/* Project Info */}
                <div className="mb-6">
                  <h4 className="font-bold text-lg mb-4">Project Information</h4>
                  <input
                    type="text"
                    placeholder="Project Name"
                    required
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>

                {/* Shipping Address */}
                <div className="mb-6">
                  <h4 className="font-bold text-lg mb-4">Shipping Address</h4>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Address Line 1"
                      required
                      value={formData.address1}
                      onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Address Line 2 (Optional)"
                      value={formData.address2}
                      onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                    <div className="grid md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="border border-gray-300 rounded-lg px-4 py-2"
                      />
                      <select
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="border border-gray-300 rounded-lg px-4 py-2"
                      >
                        {US_STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="ZIP"
                        required
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                        className="border border-gray-300 rounded-lg px-4 py-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="mb-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-lg mb-3">Order Summary</h4>
                  <div className="space-y-2 mb-3">
                    {cart.map((item) => (
                      <div key={item.item_code} className="flex justify-between text-sm">
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-semibold">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-blue-700">${cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                {orderError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {orderError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Order Received!</h3>
            <p className="text-gray-600 mb-6">
              Order #{orderSuccess} has been successfully submitted. We'll contact you shortly.
            </p>
            <button
              onClick={() => setOrderSuccess(null)}
              className="btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-navy text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">SIPs by FBX</h3>
          <p className="text-gray-400 mb-4">Building the future with structural insulated panels</p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <span>Contact: info@sipsbyfbx.com</span>
            <span>Phone: (555) 123-4567</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
