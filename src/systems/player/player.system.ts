import {
  PhysicsEngine,
  PhysicsRaycastResult,
  Ray,
  RayHelper,
  Vector3,
} from '@babylonjs/core'
import { camera, scene } from '../../main'
import { type Player, gameComponent } from '../../types'
import { OnPointerDownEvent } from '../../utils/pointerEvents'
import { getStore } from '../../utils/store'
import { getEnemy, removeEnemy } from '../enemy/ememy.crud'
import { killEnemy } from '../enemy/killEnemy'

export const playerSystem = () => {
  getStore().addEventHandler<OnPointerDownEvent>('OnPointerDown', (event) => {
    if (event.payload.pointerInfo.event.button !== 0) return
    const origin = camera.position

    // let viewer = new BABYLON.Debug.PhysicsViewer(scene);
    // for (let mesh of scene.meshes) {
    //     if (mesh.physicsBody) {
    //         viewer.showBody(mesh.physicsBody);
    //     }
    // }

    const forward = Vector3.TransformCoordinates(
      new Vector3(0, 0, 1),
      camera.getWorldMatrix()
    )

    const direction = Vector3.Normalize(forward.subtract(origin))

    var pickingRay = new Ray(new Vector3(0, 0, 0), new Vector3(0, 1, 0))
    var raycastResult = new PhysicsRaycastResult()
    const length = 100

    scene.createPickingRayToRef(
      scene.pointerX,
      scene.pointerY,
      null,
      pickingRay,
      camera
    )
    var rayHelper = new RayHelper(pickingRay);
    rayHelper.show(scene);

    var physEngine = scene.getPhysicsEngine() as PhysicsEngine

    if (!physEngine) return

    physEngine.raycastToRef(
      pickingRay.origin,
      pickingRay.origin.add(pickingRay.direction.scale(length)),
      raycastResult
    )
    const hit = raycastResult.hasHit
    const hitPos = raycastResult.hitPointWorld

    // const length = 100
    // const ray = new Ray(origin, direction, length)

    // const hit = scene.pickWithRay(ray, (mesh) => {
    //   const entity = mesh?.metadata?.entity

    //   if (entity) {
    //     const enemy = getEnemy(entity)
    //     return Boolean(enemy)
    //   }

    //   return false
    // })

    console.log(hit)

    // if (hit?.hit) {
    //   const enemyEntity = hit.pickedMesh?.metadata.entity
    //   killEnemy(enemyEntity)
    // }
  })

  getStore().createSystem<Player>({
    name: gameComponent.player,
    componentName: gameComponent.player,
  })
}
