import { generateEntity } from '@arekrado/canvas-engine'
import { createGrid, updateGrid } from '../grid/grid.crud'
import { getEmptyGrid, gridEntity } from '../grid/grid.system'
import { addGridEntity } from '../grid/reportPositionToGrid'

export const injectEmptyGrid = () => {
  createGrid(gridEntity, getEmptyGrid())

  const gridSchema = Array.from({ length: 100 }, () =>
    Array.from({ length: 100 }, () => '.')
  )

  updateGrid(gridEntity, () => ({
    walkableTiles: gridSchema.map((row) => row.map(() => true)),
  }))

  for (let i = 0; i < gridSchema.length; i++) {
    for (let j = 0; j < gridSchema.length; j++) {
      addGridEntity({
        position: { x: j, y: i, z: 0 },
        entity: generateEntity(),
        isTileBlocked: gridSchema[i][j] === 'x' || i === 99,
      })
    }
  }
}
