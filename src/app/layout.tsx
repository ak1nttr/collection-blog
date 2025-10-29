import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Koleksiyon Blog',
  description: 'Koleksiyon Blog',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  )
}