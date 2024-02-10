import { Entity } from '@arekrado/canvas-engine'
import { scene } from '../../main'

export const killEnemy = (entity: Entity) => {
  const e = scene.getMeshByName(entity)
  console.log(e)

  // const ragdoll = new Ragdoll(skeleton, newMeshes[0], config);
}
