import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}