'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CartItem, CustomerInfo } from '../types'

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CustomerInfo>({
    customer_name: '',
    email: '',
    phone: '',
    project_address: '',
    project_type: ''
  })

  useEffect(() => {
    const savedCart = sessionStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    } else {
      router.push('/order')
    }
  }, [router])

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const orderData = {
        customer: formData,
        items: cart.map(item => ({
          item_code: item.product.item_code,
          qty: item.quantity,
          rate: item.product.price
        }))
      }

      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (result.success) {
        sessionStorage.setItem('orderResult', JSON.stringify(result))
        sessionStorage.removeItem('cart')
        router.push('/success')
      } else {
        alert(`Order failed: ${result.error}`)
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Order submission error:', error)
      alert('Failed to submit order. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Information Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card">
            <h2 className="text-2xl font-bold mb-6">Customer Information</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="customer_name" className="label">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="customer_name"
                  name="customer_name"
                  required
                  value={formData.customer_name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label htmlFor="email" className="label">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="label">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="project_address" className="label">
                  Project Address *
                </label>
                <input
                  type="text"
                  id="project_address"
                  name="project_address"
                  required
                  value={formData.project_address}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="123 Main St, City, State, ZIP"
                />
              </div>

              <div>
                <label htmlFor="project_type" className="label">
                  Project Type *
                </label>
                <select
                  id="project_type"
                  name="project_type"
                  required
                  value={formData.project_type}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select project type...</option>
                  <option value="Residential - New Construction">Residential - New Construction</option>
                  <option value="Residential - Addition">Residential - Addition</option>
                  <option value="Commercial - New Construction">Commercial - New Construction</option>
                  <option value="Commercial - Renovation">Commercial - Renovation</option>
                  <option value="Agricultural">Agricultural</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing Order...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.product.item_code} className="border-b pb-4">
                  <h4 className="font-semibold">{item.product.name}</h4>
                  <p className="text-sm text-gray-600">
                    ${item.product.price.toLocaleString()} x {item.quantity}
                  </p>
                  <div className="font-bold mt-1">
                    ${(item.product.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span className="text-brand-green">
                  ${calculateTotal().toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Delivery in 30 days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
