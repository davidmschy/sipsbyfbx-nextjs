import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cart, customer, project } = body

    if (!cart || cart.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Create line items for Stripe
    const lineItems = cart.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          description: item.product.itemCode,
        },
        unit_amount: Math.round(item.product.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Prepare metadata (Stripe has 500 char limit per field)
    const cartData = cart.map((item: any) => ({
      itemCode: item.product.itemCode,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }))

    const metadata: Record<string, string> = {
      customer_first_name: customer.firstName || '',
      customer_last_name: customer.lastName || '',
      customer_email: customer.email || '',
      customer_phone: customer.phone || '',
      customer_company: customer.company || '',
      project_name: project.projectName || '',
      delivery_street: project.deliveryAddress.street || '',
      delivery_city: project.deliveryAddress.city || '',
      delivery_state: project.deliveryAddress.state || '',
      delivery_zip: project.deliveryAddress.zip || '',
      delivery_date: project.estimatedDeliveryDate || '',
      project_notes: (project.notes || '').substring(0, 450), // Truncate to fit limit
      cart_items: JSON.stringify(cartData).substring(0, 490), // Reserve space
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/checkout`,
      metadata,
      customer_email: customer.email,
      billing_address_collection: 'auto',
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout session error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
