import {
  PhysicsEngine,
  PhysicsRaycastResult,
  Ray,
  Vector3,
} from '@babylonjs/core'
import { camera, engine, scene } from '../../main'
import { type Player, gameComponent } from '../../types'
import { OnPointerDownEvent } from '../../utils/pointerEvents'
import { getStore } from '../../utils/store'
import { killEnemy } from '../enemy/killEnemy'

export const playerSystem = () => {
  getStore().addEventHandler<OnPointerDownEvent>('OnPointerDown', (event) => {
    if (event.payload.pointerInfo.event.button !== 0) return

    const pickingRay = new Ray(new Vector3(0, 0, 0), new Vector3(0, 1, 0))
    const raycastResult = new PhysicsRaycastResult()
    const length = 100

    console.log(scene.pointerX, scene.pointerY)

    const gunPointerPosition = engine.isPointerLock
      ? [window.innerWidth / 2, window.innerHeight / 2]
      : [scene.pointerX, scene.pointerY]

    scene.createPickingRayToRef(
      gunPointerPosition[0],
      gunPointerPosition[1],
      null,
      pickingRay,
      camera
    )
    // const rayHelper = new RayHelper(pickingRay)
    // rayHelper.show(scene)

    const physEngine = scene.getPhysicsEngine() as PhysicsEngine

    if (!physEngine) return

    physEngine.raycastToRef(
      pickingRay.origin,
      pickingRay.origin.add(pickingRay.direction.scale(length)),
      raycastResult
    )

    if (raycastResult.body?.transformNode.metadata.entity) {
      killEnemy(raycastResult.body?.transformNode.metadata.entity)
    }
  })

  getStore().createSystem<Player>({
    name: gameComponent.player,
    componentName: gameComponent.player,
  })
}
