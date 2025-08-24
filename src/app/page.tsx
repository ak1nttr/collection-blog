import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Your App</h1>
        <p className="text-gray-600 mb-8">Welcome to the app</p>
        
        <Link 
          href="/admin" 
          className="text-red-600 hover:underline"
        >
          Admin Login
        </Link>
      </div>
    </div>
  )
}
