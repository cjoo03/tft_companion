'use client'
import { useQuery } from '@tanstack/react-query'
import { Champion } from '@/types'
import {
  DndContext,
  useSensors,
  useSensor,
  PointerSensor,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { transformSet13Champions } from '@/lib/utils/championTransforms'
import rawData from '@/lib/constants/tftchampions_set13'

function SortableChampion({ champion }: { champion: Champion }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: champion.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-24 h-32 bg-white rounded-lg shadow-md flex flex-col items-center justify-center p-2 cursor-pointer hover:bg-gray-100"
    >
      <div className="text-center w-full">
        <div className="text-sm font-bold truncate">{champion.name}</div>
        <div className="text-xs text-gray-500">{champion.cost}⭐</div>
        <div className="text-xs mt-1 text-gray-600 truncate">
          {champion.traits.join(', ')}
        </div>
      </div>
    </div>
  )
}

export default function ChampionPool() {
  const champions = transformSet13Champions(rawData)
  const sensors = useSensors(useSensor(PointerSensor))

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4">
      <DndContext sensors={sensors}>
        {/* <SortableContext 
          items={champions.map(c => c.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex flex-wrap gap-2 overflow-x-auto max-h-40">
            {champions.map((champion) => (
              <SortableChampion key={champion.id} champion={champion} />
            ))}
          </div>
        // </SortableContext> */}
      </DndContext>
    </div>
  )
} 