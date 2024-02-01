import { type StandardMaterialType, gameComponent } from '../../types'
import { scene } from '../../main'
import { StandardMaterial, Texture } from '@babylonjs/core'
import { getStore } from '../../utils/store'

export const standardMaterialSystem = () => {
  getStore().createSystem<StandardMaterialType>({
    name: gameComponent.standardMaterial,
    componentName: gameComponent.standardMaterial,
    create: ({ entity, component }) => {
      component.ref = new StandardMaterial(entity, scene)

      if (component.diffuseTextureUrl) {
        component.ref.diffuseTexture = new Texture(
          component.diffuseTextureUrl,
          scene
        )
        component.ref.diffuseTexture.hasAlpha = true
      }
    },
    remove: ({ component }) => {
      component.ref?.diffuseTexture?.dispose()
      component.ref?.dispose()
    },
  })
}
