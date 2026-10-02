import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KindBites - Share food, nourish communities',
  description: 'Connect food providers with NGOs and shelters to share available food and strengthen communities.',
  keywords: 'food rescue, food donation, available food, NGO, food sharing, hunger relief',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-green-50">
          {children}
        </div>
      </body>
    </html>
  )
}
