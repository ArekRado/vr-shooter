import { Entity } from '@arekrado/canvas-engine'
import { Position, State } from '../../types'
import { getGrid, updateGrid } from './grid.crud'
import { gridEntity } from './grid.system'
import { Vector2D } from '@arekrado/vector-2d'
import { updatePathfinding } from './pathfinding'

export const mapPositionToGridPosition = (position: Position): Vector2D => [
  Math.floor(position.x),
  Math.floor(position.z),
]

export const getKey = (index: Vector2D) => `${index[0]}-${index[1]}`

export const getTile = <X>({
  index,
  grid,
}: {
  index: Vector2D
  grid: Map<string, Set<X>>
}): Set<X> | undefined => {
  const key = getKey(index)
  const tile = grid.get(key)

  return tile
}

export const addElementToTile = <X>({
  index,
  value,
  grid,
}: {
  index: Vector2D
  value: X
  grid: Map<string, Set<X>>
}): Map<string, Set<X>> => {
  const key = getKey(index)
  const tile = grid.get(key) ?? new Set()

  tile.add(value)
  grid.set(key, tile)

  return grid
}

export const removeElementFromTile = <X>({
  index,
  value,
  grid,
}: {
  index: Vector2D
  value: X
  grid: Map<string, Set<X>>
}): Map<string, Set<X>> => {
  const key = getKey(index)
  const tile = grid.get(key)

  if (tile) {
    tile.delete(value)
    grid.set(key, tile)
  }

  return grid
}

export const removeGridEntity = ({
  position,
  entity,
  isTileBlocked,
}: {
  position: Position
  entity: Entity
  isTileBlocked: boolean
}) => {
  const grid = getGrid(gridEntity)
  if (!grid) return

  const gridPosition = mapPositionToGridPosition(position)

  updateGrid(gridEntity, (grid) => ({
    blockedTiles: removeElementFromTile({
      index: gridPosition,
      value: entity,
      grid: grid.blockedTiles,
    }),
    entities: removeElementFromTile({
      index: gridPosition,
      value: entity,
      grid: grid.entities,
    }),
  }))

  if (isTileBlocked) {
    updatePathfinding(grid)
  }

  return
}

export const addGridEntity = ({
  position,
  entity,
  isTileBlocked,
}: {
  position: Position
  entity: Entity
  isTileBlocked: boolean
}) => {
  const grid = getGrid(gridEntity)
  if (!grid) return

  const gridPosition = mapPositionToGridPosition(position)

  if (import.meta.env.MODE === 'development') {
    if (gridPosition[0] < 0 || gridPosition[1] < 0) {
      console.warn('Position cant be under index 0')
      return
    }
  }

  if (isTileBlocked === true) {
    updateGrid(gridEntity, (grid) => ({
      blockedTiles: addElementToTile({
        index: gridPosition,
        value: entity,
        grid: grid.blockedTiles,
      }),
    }))

    const grid = getGrid(gridEntity)
    grid && updatePathfinding(grid)
  }

  updateGrid(gridEntity, (grid) => ({
    entities: addElementToTile({
      index: gridPosition,
      value: entity,
      grid: grid.entities,
    }),
  }))
}

export const updateGridEntity = ({
  previousPosition,
  newPosition,
  entity,
  isTileBlocked,
}: {
  previousPosition: Position
  newPosition: Position
  entity: Entity
  isTileBlocked: boolean
}) => {
  const grid = getGrid(gridEntity)
  if (!grid) return 

  const previousGridPosition = mapPositionToGridPosition(previousPosition)
  const tile = getTile({ index: previousGridPosition, grid: grid.entities })
  if (!tile) return 

  removeGridEntity({
    position: previousPosition,
    entity,
    isTileBlocked,
  })

  addGridEntity({
    position: newPosition,
    entity,
    isTileBlocked,
  })
}
