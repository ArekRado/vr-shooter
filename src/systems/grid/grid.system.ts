import { ECSEvent, generateEntity } from '@arekrado/canvas-engine'
import { Grid, gameComponent } from '../../types'
import { createGrid } from './grid.crud'
import { ICanvasRenderingContext } from '@babylonjs/core'

import { getStore } from '../../utils/store'

export const gridEntity = generateEntity()

export type GenerateGridFromMapEvent = ECSEvent<
  'generateGridFromMap',
  ICanvasRenderingContext | null
>

export type GenerateGridFromMapFinishedEvent = ECSEvent<
  'generateGridFromMapFinished',
  null
>

export const getEmptyGrid = (): Grid => ({
  blockedTiles: new Map(),
  entities: new Map(),

  heightTiles: [],
  walkableTiles: [],
})

export const gridSystem = () => {
  createGrid(gridEntity, getEmptyGrid())

  getStore().createSystem<Grid>({
    componentName: gameComponent.grid,
    name: gameComponent.grid,
  })
}
