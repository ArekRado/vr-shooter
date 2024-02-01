import {
  Color3,
  CubeTexture,
  MeshBuilder,
  StandardMaterial,
  Texture,
} from '@babylonjs/core'
import { scene } from '../../main'
import { isTestEnabled } from '../../utils/isTestEnabled'

export const skyboxBlueprint = () => {
  if (!isTestEnabled) {
    const skybox = MeshBuilder.CreateBox('skyBox', { size: 1000.0 }, scene)
    const skyboxMaterial = new StandardMaterial('skyBox', scene)

    skyboxMaterial.backFaceCulling = false
    skyboxMaterial.reflectionTexture = new CubeTexture('textures/skybox', scene)
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0)
    skyboxMaterial.specularColor = new Color3(0, 0, 0)
    skybox.material = skyboxMaterial
  }
}
