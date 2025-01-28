'use client'
import { useQuery } from '@tanstack/react-query'
import { getMetaCompositions } from '@/lib/api'
import type { MetaCompsResponse } from '@/types'

export default function MetaComps() {
  const { data, isLoading, error } = useQuery<MetaCompsResponse>({
    queryKey: ['metaComps'],
    queryFn: getMetaCompositions,
    retry: false // This will prevent retrying failed requests
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return (
    <div className="text-red-500">
      Error: {(error as Error).message}
      <pre className="text-sm mt-2 bg-red-50 p-2 rounded">
        {JSON.stringify(error, null, 2)}
      </pre>
    </div>
  )

  return (
    <div className="space-y-4">
      {data?.compositions.map((comp, index) => (
        <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">{comp.name}</h3>
            <span className={`px-2 py-1 rounded text-white ${
              comp.tier === 'S' ? 'bg-purple-600' :
              comp.tier === 'A' ? 'bg-blue-600' :
              'bg-gray-600'
            }`}>
              Tier {comp.tier}
            </span>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-sm font-semibold text-gray-600">Champions:</p>
              <div className="flex flex-wrap gap-2">
                {comp.champions.map((champion, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">
                    {champion}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Traits:</p>
              <div className="flex flex-wrap gap-2">
                {comp.traits.map((trait, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 rounded text-sm">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 