import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Date Range Picker Demo',
  description: 'Demo of the DateRangePicker component for shadcn',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

