'use client'
//adding comments
import Navbar from '@/components/Navbar'
import TftProfile from '@/components/TftProfile'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">TFT Profile Lookup</h2>
          <TftProfile />
        </div>
      </main>
    </div>
  )
}