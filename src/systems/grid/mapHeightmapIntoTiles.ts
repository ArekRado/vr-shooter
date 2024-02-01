import { ICanvasRenderingContext } from '@babylonjs/core'
import {
  mapMaxHeight,
  mapTextureSizePixels,
  mountainLevel,
  tileSize,
  waterLevel,
} from '../map/map.blueprint'
import { Grid } from '../../types'

const MaxRgbColorValue = 255
const mapHeightToMapHeight = (height: number) =>
  (height / MaxRgbColorValue) * mapMaxHeight

export const mapHeightmapToTiles = ({
  heightmapContext,
}: {
  heightmapContext: ICanvasRenderingContext
}): {
  walkableTiles: Grid['walkableTiles']
  heightTiles: Grid['heightTiles']
} => {
  const imageData = heightmapContext.getImageData(
    0,
    0,
    mapTextureSizePixels,
    mapTextureSizePixels
  )

  const tilesPerRow = mapTextureSizePixels / tileSize
  const toupleLength = 4 // one color is coded by 4 numbers
  const gridLength = tilesPerRow * tilesPerRow
  const walkableTiles: Grid['walkableTiles'] = []
  const heightTiles: Grid['heightTiles'] = []

  for (let i = 0; i < gridLength; i += 1) {
    const x = i % tilesPerRow
    const y = Math.trunc(i / tilesPerRow)

    const imageDataIndex = y * mapTextureSizePixels + x
    const value = imageData.data[imageDataIndex * tileSize * toupleLength]

    const rY = tilesPerRow - y - 1
    if (walkableTiles[x] === undefined) {
      walkableTiles[x] = Array.from({ length: tilesPerRow })
      heightTiles[x] = Array.from({ length: tilesPerRow })
    }

    heightTiles[x][rY] = mapHeightToMapHeight(value)

    const isWalakable = value > waterLevel && value < mountainLevel
    walkableTiles[x][rY] = isWalakable
  }

  return { walkableTiles, heightTiles }
}
