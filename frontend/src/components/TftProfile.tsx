'use client'
import { useState } from 'react'
import api from '@/lib/api'  // Import the api client

interface TftMatch {
  match_id: string
  placement: number
  augments: string[]
  traits: Array<{
    name: string
    num_units: number
    style: number
    tier_current: number
  }>
  units: Array<{
    character_id: string
    items: number[]
    name: string
    rarity: number
    tier: number
  }>
  game_variation: string
  game_datetime: number
}

interface TftProfileData {
  account: {
    gameName: string
    tagLine: string
  }
  summoner: {
    name: string
    summonerLevel: number
    profileIconId: number
  }
  tft_data: Array<{
    queueType: string
    tier: string
    rank: string
    leaguePoints: number
    wins: number
    losses: number
  }>
  recent_matches: TftMatch[]
}

export default function TftProfile() {
  const [gameName, setGameName] = useState('')
  const [tagLine, setTagLine] = useState('')
  const [region, setRegion] = useState('na1')
  const [profileData, setProfileData] = useState<TftProfileData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await api.get<TftProfileData>(
        `/api/tft/summoner/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
      )
      setProfileData(response.data)
    } catch (err: any) {
      console.error('API Error:', {
        message: err.response?.data?.detail || err.message,
        status: err.response?.status
      })
      setError(err.response?.data?.detail || 'Failed to fetch player data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder="Game Name"
            className="px-3 py-2 border rounded flex-grow"
            required
          />
          <input
            type="text"
            value={tagLine}
            onChange={(e) => setTagLine(e.target.value)}
            placeholder="Tag Line (e.g., NA1)"
            className="px-3 py-2 border rounded w-32"
            required
          />
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="na1">NA</option>
            <option value="euw1">EUW</option>
            <option value="kr">KR</option>
            {/* Add other regions as needed */}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="text-red-900 bg-red-50 p-3 rounded border border-red-200">
          {error}
        </div>
      )}

      {/* Update the profile data display based on the new data structure */}
      {profileData && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="mb-4">
            <h3 className="text-xl font-bold">{profileData.account.gameName}#{profileData.account.tagLine}</h3>
            <p className="text-gray-600">Level {profileData.summoner.summonerLevel}</p>
          </div>

          {profileData.tft_data.map((entry, index) => (
            <div key={index} className="mt-4">
              <h4 className="font-semibold">{entry.queueType}</h4>
              <p>
                {entry.tier} {entry.rank} - {entry.leaguePoints} LP
              </p>
              <p>
                Wins: {entry.wins} | Losses: {entry.losses} | 
                Win Rate: {((entry.wins / (entry.wins + entry.losses)) * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 