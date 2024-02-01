import { DynamicTexture, Mesh, StandardMaterial } from '@babylonjs/core'
import { mapEntity, mapTextureSizePixels, tileSize } from '../map/map.blueprint'
import { getMap } from '../map/map.crud'
import { getGrid } from './grid.crud'
import { gridEntity } from './grid.system'
import { scene } from '../../main'
import { getTile } from './reportPositionToGrid'
import { Vector2D } from '@arekrado/vector-2d'

const red = '#ff0000'
const green = '#0f0'

export let gridMesh: Mesh | null = null
export let gridMaterial: StandardMaterial | null = null
export let gridTexture: DynamicTexture | null = null

export const showGrid = () => {
  const grid = getGrid(gridEntity)
  const map = getMap(mapEntity)

  if (!grid || !map) return
  const blockedTiles = grid.blockedTiles
  const walkableTiles = grid.walkableTiles

  gridMesh = map.mesh.clone('grid')

  gridMaterial = new StandardMaterial('grid', scene)
  gridTexture = new DynamicTexture('grid', mapTextureSizePixels, scene)

  gridMaterial.diffuseTexture = gridTexture
  gridMaterial.diffuseTexture.hasAlpha = true
  gridMaterial.zOffset = -2

  gridMesh.material = gridMaterial

  const gridTextureContext = gridTexture.getContext()

  for (let i = 0; i < walkableTiles[0].length; i++) {
    for (let j = 0; j < walkableTiles[0].length; j++) {
      const index: Vector2D = [i, walkableTiles[0].length - j - 1]

      const isWalakable = walkableTiles[index[0]][index[1]]
      const blockingEntities =
        getTile({
          grid: blockedTiles,
          index: [index[0], index[1]],
        })?.size ?? 0
      const isBlocked = blockingEntities > 0

      gridTextureContext.strokeStyle = isWalakable && !isBlocked ? green : red
      gridTextureContext.strokeRect(
        i * tileSize,
        j * tileSize,

        tileSize,
        tileSize
      )
    }
  }

  gridTexture.update()
}
