import { type PhysicsBody, gameComponent } from '../../types'
import { scene, viewer } from '../../main'
import { Mesh, PhysicsBody as BabylonPhysicsBody } from '@babylonjs/core'
import { getStore } from '../../utils/store'

export const physicsBodySystem = () => {
  getStore().createSystem<PhysicsBody>({
    name: gameComponent.physicsBody,
    componentName: gameComponent.physicsBody,
    create: ({ entity, component }) => {
      const transformNode = scene.getTransformNodeByName(entity) as Mesh

      if (!transformNode) {
        console.log('Can not create PhysicsBody. TransformNode does not exist')
        return
      }

      const mesh = scene.getMeshByName(entity) as Mesh

      if (!mesh) {
        console.log('Can not create PhysicsBody. Mesh does not exist')
        return
      }

      const physicsBody = new BabylonPhysicsBody(
        mesh,
        component.physicsMotionType,
        component.startsAsleep,
        scene
      )

      physicsBody.setMassProperties({
        mass: 0,
      })

      mesh.physicsBody = physicsBody
    },
    remove: ({ entity }) => {
      const mesh = scene.getMeshByName(entity)
      if (mesh) {
        viewer?.hideBody(mesh.physicsBody)
        mesh.physicsBody?.dispose()
      }
    },
  })
}
