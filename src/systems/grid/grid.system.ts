import {
  ECSEvent,
  generateEntity,
} from '@arekrado/canvas-engine'
import { Grid, gameComponent } from '../../types'
import { createGrid, getGrid, updateGrid } from './grid.crud'
import { mapTextureSizePixels } from '../map/map.blueprint'
import { DynamicTexture, ICanvasRenderingContext } from '@babylonjs/core'
import map1HeightmapUrl from '../../assets/map/map2.heightmap.png'
import { scene } from '../../main'
import { mapHeightmapToTiles } from './mapHeightmapIntoTiles'
import { isTestEnabled } from '../../utils/isTestEnabled'
import { updatePathfinding } from './pathfinding'
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

  getStore().addEventHandler<GenerateGridFromMapEvent>('generateGridFromMap', (event) => {
    const { walkableTiles, heightTiles } = event.payload
      ? mapHeightmapToTiles({
          heightmapContext: event.payload,
        })
      : { walkableTiles: [], heightTiles: [] }

    updateGrid(gridEntity, () => ({
      walkableTiles,
      heightTiles,
    }))

    const grid = getGrid(gridEntity)
    if (grid) {
      updatePathfinding(grid)
    }

    getStore().emitEvent<GenerateGridFromMapFinishedEvent>({
      type: 'generateGridFromMapFinished',
      payload: null,
    })
  })

  // onload doesnt work correctly in a unit tests
  if (!isTestEnabled) {
    const gridTexture = new DynamicTexture(
      map1HeightmapUrl as string,
      mapTextureSizePixels,
      scene
    )

    const img = new Image()
    img.src = map1HeightmapUrl as string
    img.onload = function () {
      const mapTextureContext = gridTexture.getContext()
      mapTextureContext.drawImage(this, 0, 0)
      gridTexture.update()

      getStore().emitEvent<GenerateGridFromMapEvent>({
        type: 'generateGridFromMap',
        payload: mapTextureContext,
      })
    }
  } else {
    getStore().emitEvent<GenerateGridFromMapEvent>({
      type: 'generateGridFromMap',
      payload: null,
    })
  }

  getStore().createSystem<Grid>({
    componentName: gameComponent.grid,
    name: gameComponent.grid,
  })
}
