import { type PhysicsBody, gameComponent } from '../../types'
import { scene } from '../../main'
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

      const body = new BabylonPhysicsBody(
        transformNode,
        component.physicsMotionType,
        component.startsAsleep,
        scene
      )

      body.setMassProperties({
        mass: 1,
      });
    },
    remove: ({ entity }) => {
      const mesh = scene.getMeshByName(entity)
      mesh?.physicsBody?.dispose()
    },
  })
}
