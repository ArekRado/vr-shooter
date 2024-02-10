import { Entity } from '@arekrado/canvas-engine'
import { scene } from '../../main'
import { getStore } from '../../utils/store'

export const killEnemy = (entity: Entity) => {
  const e = scene.getMeshByName(entity)
  console.log(e)

  getStore().removeEntity(entity)

  // const ragdoll = new Ragdoll(skeleton, newMeshes[0], config);
}
