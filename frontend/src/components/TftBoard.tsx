'use client'
import { useState } from 'react'
import {
  DndContext,
  useSensors,
  useSensor,
  PointerSensor,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core'
import { Champion } from '@/types'
import { transformSet13Champions } from '@/lib/utils/championTransforms'
import rawData from '@/lib/constants/tftchampions_set13'
import { useDraggable } from '@dnd-kit/core'

function DraggableChampion({ champion }: { champion: Champion }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: champion.id,
    data: { champion },
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="bg-gray-700 p-2 rounded cursor-move hover:bg-gray-600 text-white"
    >
      <div className="flex items-center gap-2">
        <span className="text-yellow-500">{champion.cost}⭐</span>
        <span>{champion.name}</span>
      </div>
      <div className="text-xs text-gray-400 mt-1">
        {champion.traits.join(', ')}
      </div>
    </div>
  )
}

interface BoardCell {
  id: string
  champion: Champion | null
  row: number
  col: number
}

function HexCell({ cell, onRemoveChampion }: { 
  cell: BoardCell; 
  onRemoveChampion: (cellId: string) => void 
}) {
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: cell.id,
  })

  const { attributes, listeners, setNodeRef: setDraggableRef } = useDraggable({
    id: `draggable-${cell.id}`,
    data: { 
      champion: cell.champion,
      fromCell: cell.id 
    },
    disabled: !cell.champion
  })

  // Combine the refs
  const setRef = (element: HTMLElement | null) => {
    setDroppableRef(element)
    setDraggableRef(element)
  }

  return (
    <div
      ref={setRef}
      {...attributes}
      {...listeners}
      className={`hex-cell ${cell.champion ? 'occupied' : 'empty'}`}
      onDoubleClick={() => cell.champion && onRemoveChampion(cell.id)}
    >
      {cell.champion && (
        <div className="text-white z-10 relative w-full h-full flex items-center justify-center">
          {cell.champion.name}
        </div>
      )}
    </div>
  )
}

function ChampionList({ champions }: { champions: Champion[] }) {
  const [sortBy, setSortBy] = useState<'cost' | 'name' | 'trait'>('cost')
  const [selectedTrait, setSelectedTrait] = useState<string>('')
  
  const allTraits = Array.from(new Set(
    champions.flatMap(champion => champion.traits)
  )).sort()

  const filteredChampions = selectedTrait
    ? champions.filter(champion => champion.traits.includes(selectedTrait))
    : champions

  const sortedChampions = [...filteredChampions].sort((a, b) => {
    if (sortBy === 'cost') {
      return a.cost !== b.cost ? a.cost - b.cost : a.name.localeCompare(b.name)
    }
    if (sortBy === 'trait') {
      if (selectedTrait) {
        const aHasTrait = a.traits.includes(selectedTrait)
        const bHasTrait = b.traits.includes(selectedTrait)
        if (aHasTrait !== bHasTrait) return bHasTrait ? 1 : -1
      }
      return a.traits[0].localeCompare(b.traits[0])
    }
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="w-72 bg-gray-800 p-4 rounded-lg h-[calc(100vh-2rem)] overflow-y-auto">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex gap-2">
          <button 
            className={`px-3 py-1 rounded ${sortBy === 'cost' ? 'bg-blue-500' : 'bg-gray-600'} text-white`}
            onClick={() => setSortBy('cost')}
          >
            Cost
          </button>
          <button 
            className={`px-3 py-1 rounded ${sortBy === 'name' ? 'bg-blue-500' : 'bg-gray-600'} text-white`}
            onClick={() => setSortBy('name')}
          >
            Name
          </button>
          <button 
            className={`px-3 py-1 rounded ${sortBy === 'trait' ? 'bg-blue-500' : 'bg-gray-600'} text-white`}
            onClick={() => setSortBy('trait')}
          >
            Trait
          </button>
        </div>
        
        <select
          className="bg-gray-700 text-white p-2 rounded"
          value={selectedTrait}
          onChange={(e) => setSelectedTrait(e.target.value)}
        >
          <option value="">All Traits</option>
          {allTraits.map(trait => (
            <option key={trait} value={trait}>
              {trait}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {sortedChampions.map(champion => (
          <DraggableChampion key={champion.id} champion={champion} />
        ))}
      </div>
    </div>
  )
}

interface TraitCount {
  name: string;
  count: number;
}

function TraitCounter({ board }: { board: BoardCell[] }) {
  // Get all champions currently on the board
  const activeChampions = board.filter(cell => cell.champion !== null)

  // Create a map of unique champions and their counts
  const championCounts = activeChampions.reduce((counts: { [key: string]: number }, cell) => {
    if (cell.champion) {
      counts[cell.champion.id] = (counts[cell.champion.id] || 0) + 1
    }
    return counts
  }, {})

  // Count traits from unique champions only
  const traitCounts = activeChampions.reduce((counts: { [key: string]: number }, cell) => {
    if (cell.champion) {
      // Only count traits once per unique champion
      if (championCounts[cell.champion.id] > 0) {
        cell.champion.traits.forEach(trait => {
          counts[trait] = (counts[trait] || 0) + 1
        })
        // Mark this champion as counted
        championCounts[cell.champion.id] = 0
      }
    }
    return counts
  }, {})

  // Convert to array and sort by count (descending) then name
  const sortedTraits: TraitCount[] = Object.entries(traitCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count
      return a.name.localeCompare(b.name)
    })

  if (sortedTraits.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg w-64">
        <p className="text-gray-400 text-center">No active traits</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg w-64">
      <h2 className="text-white font-bold mb-4">Active Traits</h2>
      <div className="space-y-2">
        {sortedTraits.map(({ name, count }) => (
          <div 
            key={name} 
            className="flex justify-between items-center bg-gray-700 p-2 rounded"
          >
            <span className="text-white">{name}</span>
            <span className="text-yellow-500 font-bold">{count}</span>
          </div>
        ))}
      </div>
      
      {/* Optional: Show duplicate champions warning */}
      {Object.entries(championCounts).some(([_, count]) => count > 1) && (
        <div className="mt-4 text-yellow-500 text-sm">
          ⚠️ Duplicate champions don't stack traits
        </div>
      )}
    </div>
  )
}

export default function TftBoard() {
  const createBoard = () => {
    const cells: BoardCell[] = []
    const rowConfig = [7, 7, 7, 7]

    rowConfig.forEach((hexCount, row) => {
      for (let col = 0; col < hexCount; col++) {
        cells.push({
          id: `hex-${row}-${col}`,
          champion: null,
          row,
          col
        })
      }
    })
    return cells
  }

  const [board, setBoard] = useState<BoardCell[]>(createBoard())
  const champions = transformSet13Champions(rawData)
  const sensors = useSensors(useSensor(PointerSensor))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
  
    if (!over || !over.id.toString().startsWith('hex-')) return
  
    const fromCell = active.data.current?.fromCell
    const draggedChampion = active.data.current?.champion as Champion
    if (!draggedChampion) return
  
    const toCell = over.id as string
  
    setBoard((prev) =>
      prev.map((cell) => {
        // If this is where we're dropping the champion
        if (cell.id === toCell) {
          return { ...cell, champion: draggedChampion }
        }
        // If this is where we're dragging from, clear the cell
        if (cell.id === fromCell) {
          return { ...cell, champion: null }
        }
        return cell
      })
    )
  }  

  function handleRemoveChampion(cellId: string) {
    setBoard((prev) =>
      prev.map((cell) =>
        cell.id === cellId ? { ...cell, champion: null } : cell
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="flex justify-between items-start gap-8">
        <TraitCounter board={board} />
        
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Team Builder</h1>
            <button
              onClick={() => setBoard(createBoard())}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
            >
              Clear Board
            </button>
          </div>
          
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="flex justify-between items-start gap-8">
              <div className="flex-1">
                <div className="board-container">
                  {[0, 1, 2, 3].map((row) => (
                    <div key={row} className={`hex-row ${row % 2 === 0 ? 'even' : 'odd'}`}>
                      {board
                        .filter((cell) => cell.row === row)
                        .map((cell) => (
                          <HexCell 
                            key={cell.id} 
                            cell={cell} 
                            onRemoveChampion={handleRemoveChampion}
                          />
                        ))}
                    </div>
                  ))}
                </div>
              </div>
              
              <ChampionList champions={champions} />
            </div>
          </DndContext>
        </div>
      </div>

      <style jsx global>{`
        .board-container {
          background: #0a192f;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          width: fit-content;
          margin: 0 auto;
        }

        .hex-row {
          display: flex;
          gap: 4px;
          margin: -15px 0;
        }

        .hex-row.odd {
          margin-left: 52px;
        }

        .hex-cell {
          width: 100px;
          height: 115px;
          background: #1a2942;
          position: relative;
          clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .hex-cell::before {
          content: '';
          position: absolute;
          width: calc(100% - 4px);
          height: calc(100% - 4px);
          background: #0a192f;
          clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
          z-index: 1;
        }

        .hex-cell.empty:hover::before {
          background: #152238;
        }

        .hex-cell.occupied::before {
          background: #1f2b42;
        }

        .hex-cell.occupied {
          cursor: grab;
        }

        .hex-cell.occupied:active {
          cursor: grabbing;
        }
      `}</style>
    </div>
  )
} 