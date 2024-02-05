import { Ray, Vector3 } from '@babylonjs/core'
import { camera, scene } from '../../main'
import { type Player, gameComponent } from '../../types'
import {
  OnPointerDownEvent,
} from '../../utils/pointerEvents'
import { getStore } from '../../utils/store'
import { getEnemy, removeEnemy } from '../enemy/ememy.crud'
import { killEnemy } from '../enemy/killEnemy'

export const playerSystem = () => {
  getStore().addEventHandler<OnPointerDownEvent>('OnPointerDown', (event) => {

    if (event.payload.pointerInfo.event.button !== 0) return
    const origin = camera.position

    const forward = Vector3.TransformCoordinates(
      new Vector3(0, 0, 1),
      camera.getWorldMatrix()
    )

    const direction = Vector3.Normalize(forward.subtract(origin))

    const length = 100
    const ray = new Ray(origin, direction, length)

    const hit = scene.pickWithRay(ray, (mesh) => {
      const entity = mesh?.metadata?.entity

      if (entity) {
        const enemy = getEnemy(entity)
        return Boolean(enemy)
      }

      return false
    })

    if (hit?.hit) {
      const enemyEntity = hit.pickedMesh?.metadata.entity
      killEnemy(enemyEntity)
    }
  })

  getStore().createSystem<Player>({
    name: gameComponent.player,
    componentName: gameComponent.player,
  })
}
