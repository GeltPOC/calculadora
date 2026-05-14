import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Calculadora Científica',
  description: 'Calculadora científica con funciones avanzadas',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex items-center justify-center p-4">{children}</body>
    </html>
  )
}
