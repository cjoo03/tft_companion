'use client'
//adding comments
import Navbar from '@/components/Navbar'
import TftBoard from '@/components/TftBoard'
import ChampionPool from '@/components/ChampionPool'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Team Builder</h2>
          <TftBoard />
          <div className="mt-4">
            <ChampionPool />
          </div>
        </div>
      </main>
    </div>
  )
}