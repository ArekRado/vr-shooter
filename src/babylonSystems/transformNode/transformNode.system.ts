import { type TransformNode, gameComponent } from '../../types'
import { scene } from '../../main'
import { Mesh, TransformNode as BabylonTransformNode } from '@babylonjs/core'
import { getStore } from '../../utils/store'

export const transformNodeSystem = () => {
  getStore().createSystem<TransformNode>({
    name: gameComponent.transformNode,
    componentName: gameComponent.transformNode,
    create: ({ entity, component }) => {
      const transformNode = new BabylonTransformNode(entity, scene)

      transformNode.position.x = component.position.x
      transformNode.position.y = component.position.y
      transformNode.position.z = component.position.z
    },
    remove: ({ entity }) => {
      const transformNode = scene.getTransformNodeByName(entity)
      transformNode?.dispose()
    },
  })
}
