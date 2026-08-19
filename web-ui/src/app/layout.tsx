import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Epicurean - Restaurant Management System',
  description: 'Premium restaurant management system for ordering and menu management.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
