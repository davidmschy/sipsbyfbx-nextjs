import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SIPs by FBX - Structural Insulated Panels Direct',
  description: 'Factory-direct structural insulated panels at 57% below market prices. No middleman markup.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <nav className="bg-brand-green text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold">SIPs by FBX</h1>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a href="/" className="hover:bg-brand-light px-3 py-2 rounded-md text-sm font-medium">
                    Home
                  </a>
                  <a href="/order" className="hover:bg-brand-light px-3 py-2 rounded-md text-sm font-medium">
                    Order Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="bg-gray-100 mt-16">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-600">
              © 2026 SIPs by FBX. Factory Direct Pricing. No Middleman.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}