import { Grid, State } from '../../types'
import { Vector2D, add } from '@arekrado/vector-2d'

import { Graph, astar } from './astar.js'
import { getTile } from './reportPositionToGrid.js'
import { gridEntity } from './grid.system.js'
import { getGrid } from './grid.crud.js'

export const getNonBlockedTileNextToTile = ({ index }: { index: Vector2D }) => {
  const grid = getGrid(gridEntity)
  if (!grid) return undefined

  const neighbours: Vector2D[] = [
    add([-1, 1], index),
    add([0, 1], index),
    add([1, 1], index),
    add([-1, 0], index),
    add([1, 0], index),
    add([-1, -1], index),
    add([0, -1], index),
    add([1, -1], index),
  ]

  const tile = neighbours.find((tileIndex) => {
    const tile = getTile({ index: tileIndex, grid: grid.blockedTiles })
    const isEmpty = (tile?.size ?? 0) === 0

    return isEmpty
  })

  return tile
}

let graph: Graph | undefined = undefined

export const updatePathfinding = (grid: Grid) => {
  const blockedTiles: number[][] = []

  for (let i = 0; i < grid.walkableTiles.length; i++) {
    for (let j = 0; j < grid.walkableTiles[i].length; j++) {
      if (!blockedTiles[i]) blockedTiles[i] = []

      const numberOfBlockingEntities =
        getTile({ index: [i, j], grid: grid.blockedTiles })?.size ?? 0

      const isTerrainWalkable = grid.walkableTiles[i][j]
      const isWalakable = numberOfBlockingEntities === 0

      blockedTiles[i][j] = isTerrainWalkable && isWalakable ? 1 : 0
    }
  }
  graph = new Graph(blockedTiles, { diagonal: true })
}

export type AStarPath = Array<{ x: number; y: number; z: number }>

const getAstarPath = ({
  from,
  to,
}: {
  from: Vector2D
  to: Vector2D
}): AStarPath => {
  if (graph) {
    const start = graph.grid[from[0]]?.[from[1]]
    const end = graph.grid[to[0]]?.[to[1]]

    if (!start || !end) return []

    const path = astar.search(graph, start, end, {
      heuristic: astar.heuristics.diagonal,
    })

    if (path.length > 0) {
      return path as AStarPath
    }

    const endNearTile = getNonBlockedTileNextToTile({ index: to })
    if (!endNearTile) return []

    const grid = graph.grid[endNearTile[0]]?.[endNearTile[1]]

    if (!grid) return []

    return astar.search(graph, start, grid, {
      heuristic: astar.heuristics.diagonal,
    }) as AStarPath
  }

  return []
}

export const findPath = ({
  from,
  to,
}: {
  from: Vector2D
  to: Vector2D
}): AStarPath => {
  const path = getAstarPath({
    from,
    to,
  })

  const heightTiles = getGrid(gridEntity)?.heightTiles

  if (!heightTiles) {
    throw new Error('Couldnt find grid')
  }

  const pathWithHeight: AStarPath = []
  for (let i = 0; i < path.length; i++) {
    const point = path[i]

    const height = heightTiles[point.x]?.[point.y] ?? 0

    pathWithHeight.push({
      x: point.x,
      y: point.y,
      z: height,
    })
  }

  return pathWithHeight
}
