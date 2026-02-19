'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [sessionData, setSessionData] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    if (!sessionId) {
      router.push('/')
      return
    }

    // Clear cart from sessionStorage
    sessionStorage.removeItem('cart')

    // In a production app, you might want to verify the session
    // For now, we'll just show a success message
    setLoading(false)
    setSessionData({ id: sessionId })
  }, [searchParams, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-white">Processing your order...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 border border-gray-700">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-16 h-16 mx-auto text-red-500 mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-block bg-gold hover:bg-yellow-600 text-navy font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-gray-800 rounded-lg p-8 border border-gray-700">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-12 h-12 text-white"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          </div>

          {/* Thank You Message */}
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Thank You for Your Order!
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Your payment has been processed successfully.
          </p>

          {/* Order Details */}
          <div className="bg-gray-900 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gold mb-4">What Happens Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gold text-navy rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Order Confirmation</h3>
                  <p className="text-gray-400 text-sm">
                    You will receive an email confirmation with your order details and receipt.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gold text-navy rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Quote Review</h3>
                  <p className="text-gray-400 text-sm">
                    Our team will review your project requirements and contact you within 1-2 business days to confirm specifications and delivery details.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gold text-navy rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Manufacturing</h3>
                  <p className="text-gray-400 text-sm">
                    Once confirmed, your panels will be manufactured to exact specifications in our factory.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gold text-navy rounded-full flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Delivery</h3>
                  <p className="text-gray-400 text-sm">
                    Your panels will be delivered to your specified location, ready for installation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-900 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gold mb-3">Need Help?</h2>
            <p className="text-gray-300 text-sm mb-3">
              If you have any questions about your order or need to make changes, please contact us:
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400">
                <span className="text-white font-medium">Email:</span> orders@sipsbyfbx.com
              </p>
              <p className="text-gray-400">
                <span className="text-white font-medium">Phone:</span> (555) 123-4567
              </p>
              <p className="text-gray-400">
                <span className="text-white font-medium">Hours:</span> Monday - Friday, 8am - 5pm PST
              </p>
            </div>
          </div>

          {/* Session ID (for reference) */}
          {sessionData?.id && (
            <p className="text-xs text-gray-500 mb-6">
              Order Reference: {sessionData.id}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-gold hover:bg-yellow-600 text-navy font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
            >
              Back to Shop
            </Link>
            <a
              href="mailto:orders@sipsbyfbx.com"
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
