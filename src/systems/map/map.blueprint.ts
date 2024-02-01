import { generateEntity } from '@arekrado/canvas-engine'
import { createMap } from './map.crud'
import map1TextureUrl from '../../assets/map/map2.texture.png'
import map1HeightmapUrl from '../../assets/map/map2.heightmap.png'
import { DynamicTexture, MeshBuilder, StandardMaterial } from '@babylonjs/core'
import { scene } from '../../main'
import { isTestEnabled } from '../../utils/isTestEnabled'
import { getStore } from '../../utils/store'

export const mapEntity = generateEntity()
export const mapTextureSizePixels = 720
export const mapMeshSubdivisions = 100
/**
 * Amount of pixels per one tile
 */
export const tileSize = 5
export const mapMeshSize = mapTextureSizePixels / tileSize
export const mapMinHeight = 0
export const mapMaxHeight = 1

export const waterLevel = 30
export const mountainLevel = 170

const black512placeholder =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAQMAAADOtka5AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAANQTFRFAAAAp3o92gAAADZJREFUeJztwQEBAAAAgiD/r25IQAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfBuCAAAB0niJ8AAAAABJRU5ErkJggg=='

export const mapBlueprint = () => {
  const mapMaterial = new StandardMaterial('map', scene)
  const mapTexture = new DynamicTexture('map', mapTextureSizePixels, scene)

  mapMaterial.diffuseTexture = mapTexture

  // onload doesnt work correctly in a unit tests
  if (!isTestEnabled) {
    const img = new Image()
    img.src = map1TextureUrl as string
    img.onload = function () {
      const mapTextureContext = mapTexture.getContext()
      mapTextureContext.drawImage(this, 0, 0)
      mapTexture.update()
    }
  }

  // Map Mesh
  const mapMesh = MeshBuilder.CreateGroundFromHeightMap(
    'map',
    isTestEnabled ? black512placeholder : (map1HeightmapUrl as string),
    {
      width: mapMeshSize,
      height: mapMeshSize,
      subdivisions: mapMeshSubdivisions,
      minHeight: mapMinHeight,
      maxHeight: mapMaxHeight,
      updatable: true,
    }
  )
  mapMesh.material = mapMaterial

  mapMesh.position.x = mapMeshSize / 2
  mapMesh.position.y = 0
  mapMesh.position.z = mapMeshSize / 2
  mapMesh.checkCollisions = true;

  getStore().createEntity(mapEntity)

  createMap(mapEntity, {
    mesh: mapMesh,
    material: mapMaterial,
  })
}
