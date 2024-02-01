import { generateEntity } from '@arekrado/canvas-engine'
import { State } from '../../types'
import { getGrid, updateGrid } from '../grid/grid.crud'
import { gridEntity } from '../grid/grid.system'
import { updatePathfinding } from '../grid/pathfinding'
import { addGridEntity } from '../grid/reportPositionToGrid'

export const parseGridSchemaToGrid = (gridSchema: string[][]) => {
  updateGrid(gridEntity, () => ({
    walkableTiles: gridSchema.map((row) => row.map(() => true)),
  }))

  for (let i = 0; i < gridSchema.length; i++) {
    for (let j = 0; j < gridSchema.length; j++) {
      addGridEntity({
        position: { x: j, y: 0, z: i },
        entity: generateEntity(),
        isTileBlocked: gridSchema[i][j] === 'x',
      })
    }
  }

  const grid = getGrid(gridEntity)
  grid && updatePathfinding(grid)
}
