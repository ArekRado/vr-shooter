import { type PhysicsShape, gameComponent } from '../../types'
import { scene } from '../../main'
import { Mesh, PhysicsShapeConvexHull, PhysicsShapeMesh } from '@babylonjs/core'
import { getStore } from '../../utils/store'

export const physicsShapeSystem = () => {
  getStore().createSystem<PhysicsShape>({
    name: gameComponent.physicsShape,
    componentName: gameComponent.physicsShape,
    create: ({ entity, component }) => {
      const mesh = scene.getMeshByName(entity) as Mesh

      if (!mesh) {
        console.log('Can not create PhysicsShape. Mesh does not exist')
        return
      }

      if (!mesh.physicsBody) {
        console.log('Can not create PhysicsShape. PhysicsBody does not exist')
        return
      }

      let shape
      if (component.type === 'ConvexHull') {
        shape = new PhysicsShapeConvexHull(mesh, scene)
      } else {
        shape = new PhysicsShapeMesh(mesh, scene)
      }

      mesh.physicsBody.shape = shape
    },
    remove: ({ entity }) => {
      const mesh = scene.getMeshByName(entity)
      mesh?.physicsBody?.shape?.dispose()
    },
  })
}
