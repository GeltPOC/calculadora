import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Calculadora',
  description: 'Calculadora con modo oscuro y claro'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
