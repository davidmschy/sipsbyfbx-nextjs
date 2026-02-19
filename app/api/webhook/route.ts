import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

async function createERPNextCustomer(metadata: Stripe.Metadata) {
  const customerName = `${metadata.customer_first_name} ${metadata.customer_last_name}`.trim()
  
  const customerData = {
    doctype: 'Customer',
    customer_name: customerName,
    customer_type: 'Company',
    customer_group: 'Commercial',
    territory: 'United States',
    email_id: metadata.customer_email,
    mobile_no: metadata.customer_phone,
    custom_company_name: metadata.customer_company || customerName,
  }

  const response = await fetch(`${process.env.ERPNEXT_URL}/api/resource/Customer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `token ${process.env.ERPNEXT_API_KEY}:${process.env.ERPNEXT_API_SECRET}`,
    },
    body: JSON.stringify(customerData),
  })

  if (!response.ok) {
    // Try to find existing customer
    const searchResponse = await fetch(
      `${process.env.ERPNEXT_URL}/api/resource/Customer?filters=[["email_id","=","${metadata.customer_email}"]]&limit=1`,
      {
        headers: {
          'Authorization': `token ${process.env.ERPNEXT_API_KEY}:${process.env.ERPNEXT_API_SECRET}`,
        },
      }
    )
    
    if (searchResponse.ok) {
      const searchData = await searchResponse.json()
      if (searchData.data && searchData.data.length > 0) {
        return searchData.data[0].name
      }
    }
    
    throw new Error('Failed to create or find customer in ERPNext')
  }

  const data = await response.json()
  return data.data.name
}

async function createERPNextSalesOrder(
  customerName: string,
  metadata: Stripe.Metadata,
  session: Stripe.Checkout.Session
) {
  // Parse cart items from metadata
  let cartItems = []
  try {
    cartItems = JSON.parse(metadata.cart_items || '[]')
  } catch (error) {
    console.error('Failed to parse cart items:', error)
    throw new Error('Invalid cart data')
  }

  // Prepare sales order items
  const items = cartItems.map((item: any) => ({
    item_code: item.itemCode,
    item_name: item.name,
    qty: item.quantity,
    rate: item.price,
    delivery_date: metadata.delivery_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 30 days
  }))

  const salesOrderData = {
    doctype: 'Sales Order',
    customer: customerName,
    company: 'Golf Genii',
    transaction_date: new Date().toISOString().split('T')[0],
    delivery_date: metadata.delivery_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    order_type: 'Sales',
    items: items,
    shipping_address_name: metadata.delivery_street,
    custom_project_name: metadata.project_name,
    custom_delivery_address: `${metadata.delivery_street}, ${metadata.delivery_city}, ${metadata.delivery_state} ${metadata.delivery_zip}`,
    custom_notes: metadata.project_notes || '',
    custom_stripe_session_id: session.id,
    custom_stripe_payment_intent: session.payment_intent as string || '',
  }

  const response = await fetch(`${process.env.ERPNEXT_URL}/api/resource/Sales Order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `token ${process.env.ERPNEXT_API_KEY}:${process.env.ERPNEXT_API_SECRET}`,
    },
    body: JSON.stringify(salesOrderData),
  })

  if (!response.ok) {
    const errorData = await response.text()
    console.error('ERPNext Sales Order creation failed:', errorData)
    throw new Error(`Failed to create Sales Order in ERPNext: ${errorData}`)
  }

  const data = await response.json()
  return data.data.name
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    console.log('Processing completed checkout session:', session.id)

    try {
      // Create or find customer in ERPNext
      const customerName = await createERPNextCustomer(session.metadata!)
      console.log('ERPNext customer created/found:', customerName)

      // Create sales order in ERPNext
      const salesOrderName = await createERPNextSalesOrder(
        customerName,
        session.metadata!,
        session
      )
      console.log('ERPNext Sales Order created:', salesOrderName)

      return NextResponse.json({
        received: true,
        customer: customerName,
        salesOrder: salesOrderName,
      })
    } catch (error) {
      console.error('ERPNext integration error:', error)
      // Return 200 to acknowledge webhook receipt, but log the error
      return NextResponse.json({
        received: true,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return NextResponse.json({ received: true })
}
