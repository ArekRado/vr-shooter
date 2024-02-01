import 'vitest-canvas-mock'
import { afterEach, beforeEach, describe, expect, it, test } from 'vitest'
import { generateEntity } from '@arekrado/canvas-engine'
import { Grid, Position } from '../../types'
import {
  mapPositionToGridPosition,
  addGridEntity,
  addElementToTile,
  removeGridEntity,
  getKey,
  getTile,
  updateGridEntity,
} from './reportPositionToGrid'
import { Vector2D } from '@arekrado/vector-2d'
import { createGrid, getGrid, removeGrid } from './grid.crud'
import { getEmptyGrid, gridEntity } from './grid.system'
import { findPath } from './pathfinding'
import { parseGridSchemaToGrid } from '../testingUtils/parseGridSchemaToGrid'
import { resetStore } from '../../utils/store'

const newMap = (data: Record<string, any>) => new Map(Object.entries(data))
const newSet = (data: any[]) => new Set(data)

describe('grid', () => {
  describe('mapPositionToGrid', () => {
    const data: Array<{
      input: Position
      result: Vector2D
    }> = [
      { input: { x: 0, y: 0, z: 0 }, result: [0, 0] },
      { input: { x: 0, y: 0, z: 1 }, result: [0, 1] },
      { input: { x: 0, y: 0, z: 10 }, result: [0, 10] },
      { input: { x: 0, y: -1, z: 10 }, result: [0, 10] },
      { input: { x: -1, y: -1, z: -1 }, result: [-1, -1] },
      { input: { x: 100, y: 100, z: 100 }, result: [100, 100] },
    ]

    test.each(data)(
      'for input $input should return $result',
      ({ input, result }) => {
        expect(
          mapPositionToGridPosition({
            x: input.x,
            y: input.y,
            z: input.z,
          })
        ).toEqual(result)
      }
    )
  })

  describe('addElementToTile', () => {
    const data: Array<{
      input: Parameters<typeof addElementToTile>[0]
      result: ReturnType<typeof addElementToTile>
    }> = [
      {
        input: { grid: new Map(), index: [1, 1], value: 1 },
        result: newMap({ '1-1': newSet([1]) }),
      },
      {
        input: { grid: new Map(), index: [1, 2], value: 1 },
        result: newMap({ '1-2': newSet([1]) }),
      },
      {
        input: { grid: new Map(), index: [2, 1], value: 1 },
        result: newMap({ '2-1': newSet([1]) }),
      },
      {
        input: { grid: new Map(), index: [10, 19], value: 1 },
        result: newMap({ '10-19': newSet([1]) }),
      },
    ]

    test.each(data)(
      'for input $input should return $result',
      ({ input, result }) => {
        expect(addElementToTile(input)).toEqual(result)
      }
    )
  })

  describe('reportPositionToGrid', () => {
    beforeEach(() => {
      removeGrid(gridEntity)
      createGrid(gridEntity, getEmptyGrid())
    })

    afterEach(() => {
      resetStore()
    })

    describe('create', () => {
      test('should not change grid when there is no grid in a state', () => {
        const entity = generateEntity()

        removeGrid(gridEntity)
        addGridEntity({
          position: { x: 0, y: 0, z: 0 },
          entity,
          isTileBlocked: false,
        })
        const grid = getGrid(gridEntity)

        expect(grid).toBeUndefined()
      })

      test('should add new blocked tile and entity to the grid', () => {
        const entity = generateEntity()
        addGridEntity({
          position: { x: 0, y: 0, z: 0 },
          entity,
          isTileBlocked: true,
        })
        const grid = getGrid(gridEntity)

        expect(grid?.blockedTiles).toEqual(newMap({ '0-0': newSet([entity]) }))
        expect(grid?.entities).toEqual(newMap({ '0-0': newSet([entity]) }))
      })

      test('should add new blocked tile and entity to the grid - different position', () => {
        const entity = generateEntity()
        addGridEntity({
          position: { x: 2, y: 2, z: 2 },
          entity,
          isTileBlocked: true,
        })
        const grid = getGrid(gridEntity)

        expect(grid?.blockedTiles).toEqual(newMap({ '2-2': newSet([entity]) }))
        expect(grid?.entities).toEqual(newMap({ '2-2': newSet([entity]) }))
      })

      test('should add new blocked tile and entity to the grid - two reports', () => {
        const entity1 = generateEntity()
        const entity2 = generateEntity()
        addGridEntity({
          position: { x: 2, y: 2, z: 2 },
          entity: entity1,
          isTileBlocked: true,
        })
        addGridEntity({
          position: { x: 1, y: 1, z: 1 },
          entity: entity2,
          isTileBlocked: true,
        })
        const grid = getGrid(gridEntity)

        expect(grid?.blockedTiles).toEqual(
          newMap({ '1-1': newSet([entity2]), '2-2': newSet([entity1]) })
        )

        expect(grid?.entities).toEqual(
          newMap({ '1-1': newSet([entity2]), '2-2': newSet([entity1]) })
        )
      })
    })

    describe('remove', () => {
      test('should not change grid when there is no grid in a state', () => {
        const entity = generateEntity()

        removeGrid(gridEntity)
        removeGridEntity({
          position: { x: 0, y: 0, z: 0 },
          entity,
          isTileBlocked: false,
        })
        const grid = getGrid(gridEntity)

        expect(grid).toBeUndefined()
      })

      test('should remove blocked tile and entity from the grid', () => {
        const entity = generateEntity()
        addGridEntity({
          position: { x: 0, y: 0, z: 0 },
          entity,
          isTileBlocked: false,
        })
        removeGridEntity({
          position: { x: 0, y: 0, z: 0 },
          entity,
          isTileBlocked: false,
        })
        const grid = getGrid(gridEntity)

        const emptyGrid = newMap({
          [getKey([0, 0])]: new Set(),
        })

        expect(grid?.blockedTiles).toEqual(newMap([]))
        expect(grid?.entities).toEqual(emptyGrid)
      })

      test('should remove blocked tile and entity from the grid - different position', () => {
        const entity = generateEntity()
        addGridEntity({
          position: { x: 2, y: 2, z: 2 },
          entity,
          isTileBlocked: false,
        })
        removeGridEntity({
          position: { x: 2, y: 2, z: 2 },
          entity,
          isTileBlocked: false,
        })
        const grid = getGrid(gridEntity)

        const emptyGrid = newMap({
          [getKey([2, 2])]: new Set(),
        })

        expect(grid?.blockedTiles).toEqual(newMap([]))

        expect(grid?.entities).toEqual(emptyGrid)
      })

      test('should remove blocked tile and entity from the grid - two entities', () => {
        const entity1 = generateEntity()
        const entity2 = generateEntity()

        addGridEntity({
          position: { x: 2, y: 2, z: 2 },
          entity: entity1,
          isTileBlocked: false,
        })
        addGridEntity({
          position: { x: 1, y: 1, z: 1 },
          entity: entity2,
          isTileBlocked: false,
        })

        removeGridEntity({
          position: { x: 2, y: 2, z: 2 },
          entity: entity1,
          isTileBlocked: false,
        })
        removeGridEntity({
          position: { x: 1, y: 1, z: 1 },
          entity: entity2,
          isTileBlocked: false,
        })
        const grid = getGrid(gridEntity)

        const emptyGrid = newMap({
          [getKey([1, 1])]: new Set(),
          [getKey([2, 2])]: new Set(),
        })

        expect(grid?.blockedTiles).toEqual(newMap([]))
        expect(grid?.entities).toEqual(emptyGrid)
      })
    })

    describe('get', () => {
      it('should return tile elements when they exist in a grid', () => {
        const entity = generateEntity()

        addGridEntity({
          position: { x: 0, y: 0, z: 0 },
          entity,
          isTileBlocked: true,
        })
        const grid = getGrid(gridEntity) as Grid

        expect(getTile({ index: [0, 0], grid: grid.blockedTiles })).toEqual(
          newSet([entity])
        )

        expect(getTile({ index: [0, 0], grid: grid.entities })).toEqual(
          newSet([entity])
        )
      })

      it('should return undefined when tile doesnt have elements in a grid', () => {
        const grid = getGrid(gridEntity) as Grid

        expect(getTile({ index: [0, 0], grid: grid.blockedTiles })).toEqual(
          undefined
        )

        expect(getTile({ index: [0, 0], grid: grid.entities })).toEqual(
          undefined
        )
      })
    })

    describe('update', () => {
      test('should update entity in a grid', () => {
        const entity = generateEntity()

        addGridEntity({
          position: { x: 0, y: 0, z: 0 },
          entity,
          isTileBlocked: true,
        })

        const grid1 = getGrid(gridEntity) as Grid
        expect(getTile({ index: [0, 0], grid: grid1.entities })).toEqual(
          newSet([entity])
        )
        expect(getTile({ index: [5, 5], grid: grid1.entities })).toEqual(
          undefined
        )
        expect(getTile({ index: [0, 0], grid: grid1.blockedTiles })).toEqual(
          newSet([entity])
        )
        expect(getTile({ index: [5, 5], grid: grid1.blockedTiles })).toEqual(
          undefined
        )

        updateGridEntity({
          previousPosition: { x: 0, y: 0, z: 0 },
          newPosition: { x: 5, y: 5, z: 5 },
          entity,
          isTileBlocked: false,
        })

        const grid2 = getGrid(gridEntity) as Grid

        expect(getTile({ index: [0, 0], grid: grid2.entities })).toEqual(
          newSet([])
        )
        expect(getTile({ index: [5, 5], grid: grid2.entities })).toEqual(
          newSet([entity])
        )
        expect(getTile({ index: [0, 0], grid: grid2.blockedTiles })).toEqual(
          newSet([])
        )
        expect(getTile({ index: [5, 5], grid: grid2.blockedTiles })).toEqual(
          undefined
        )
      })

      test('should not update entity in a grid if it doesnt exist', () => {
        const entity = generateEntity()

        const grid1 = getGrid(gridEntity) as Grid
        expect(getTile({ index: [0, 0], grid: grid1.entities })).toEqual(
          undefined
        )
        expect(getTile({ index: [5, 5], grid: grid1.entities })).toEqual(
          undefined
        )
        expect(getTile({ index: [0, 0], grid: grid1.blockedTiles })).toEqual(
          undefined
        )
        expect(getTile({ index: [5, 5], grid: grid1.blockedTiles })).toEqual(
          undefined
        )

        updateGridEntity({
          previousPosition: { x: 0, y: 0, z: 0 },
          newPosition: { x: 5, y: 5, z: 5 },
          entity,
          isTileBlocked: false,
        })

        const grid2 = getGrid(gridEntity) as Grid

        expect(getTile({ index: [0, 0], grid: grid2.entities })).toEqual(
          undefined
        )
        expect(getTile({ index: [5, 5], grid: grid2.entities })).toEqual(
          undefined
        )
        expect(getTile({ index: [0, 0], grid: grid2.blockedTiles })).toEqual(
          undefined
        )
        expect(getTile({ index: [5, 5], grid: grid2.blockedTiles })).toEqual(
          undefined
        )
      })
    })
  })

  describe('pathfinding', () => {
    beforeEach(() => {
      removeGrid(gridEntity)
      createGrid(gridEntity, getEmptyGrid())
    })

    afterEach(() => {
      resetStore()
    })

    const data: Array<{
      from: Vector2D
      to: Vector2D
      gridSchema: string[][]
      result: Vector2D[]
    }> = [
      {
        from: [0, 0],
        to: [0, 0],
        gridSchema: [
          ['.', '.', '.'],
          ['.', '.', '.'],
          ['x', '.', '.'],
        ],
        result: [],
      },
      {
        from: [0, 0],
        to: [2, 2],
        gridSchema: [
          ['.', '.', '.'],
          ['.', '.', '.'],
          ['x', '.', '.'],
        ],
        result: [
          [1, 1],
          [2, 2],
        ],
      },
      {
        from: [0, 1],
        to: [2, 1],
        gridSchema: [
          ['.', '.', '.'],
          ['.', '.', '.'],
          ['x', '.', '.'],
        ],
        result: [
          [1, 1],
          [2, 1],
        ],
      },
      {
        from: [0, 1],
        to: [2, 1],
        gridSchema: [
          ['.', '.', '.'],
          ['.', 'x', '.'],
          ['.', '.', '.'],
        ],
        result: [
          [1, 0],
          [2, 1],
        ],
      },
      {
        from: [0, 0],
        to: [2, 0],
        gridSchema: [
          ['.', 'x', '.'],
          ['.', 'x', '.'],
          ['.', '.', '.'],
        ],
        result: [
          [0, 1],
          [1, 2],
          [2, 1],
          [2, 0],
        ],
      },
      {
        from: [0, 0],
        to: [2, 2],
        gridSchema: [
          ['.', 'x', '.', '.', '.'],
          ['.', 'x', '.', 'x', '.'],
          ['.', 'x', '.', 'x', '.'],
          ['.', 'x', 'x', 'x', '.'],
          ['.', '.', '.', '.', '.'],
        ],
        result: [
          [0, 1],
          [0, 2],
          [0, 3],
          [1, 4],
          [2, 4],
          [3, 4],
          [4, 3],
          [4, 2],
          [4, 1],
          [3, 0],
          [2, 1],
          [2, 2],
        ],
      },
    ]

    test.each(data)(
      'should return proper path',
      ({ from, to, gridSchema, result }) => {
        parseGridSchemaToGrid(gridSchema)

        const path = findPath({
          from,
          to,
        })

        expect(path?.length).toBe(result?.length)
        expect(path?.map((node) => [node.x, node.y])).toEqual(result)
      }
    )

    it('should return empty array when there is no path to goal', () => {
      const gridSchema = [
        ['.', 'x', '.'],
        ['.', 'x', '.'],
        ['.', 'x', '.'],
      ]

      parseGridSchemaToGrid(gridSchema)

      const path = findPath({
        from: [0, 1],
        to: [2, 1],
      })

      expect(path).toHaveLength(0)
    })

    test('should return the same path from any part of path', () => {
      // Prepare grid
      createGrid(gridEntity, getEmptyGrid())

      const gridSchema = [
        ['.', 'x', '.', '.', '.'],
        ['.', 'x', '.', 'x', '.'],
        ['.', 'x', '.', 'x', '.'],
        ['.', 'x', 'x', 'x', '.'],
        ['.', '.', '.', '.', '.'],
      ]

      parseGridSchemaToGrid(gridSchema)

      const path: Array<Vector2D> = [
        [0, 1],
        [0, 2],
        [0, 3],
        [1, 4],
        [2, 4],
        [3, 4],
        [4, 3],
        [4, 2],
        [4, 1],
        [3, 0],
        [2, 1],
        [2, 2],
      ]

      for (let i = 0; i < path.length - 1; i++) {
        const result = findPath({
          from: path[i],
          to: [2, 2],
        })

        expect(path.slice(i + 1, path.length)).toEqual(
          result?.map((node) => [node.x, node.y])
        )
      }
    })
  })
})
