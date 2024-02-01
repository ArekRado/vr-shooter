import { Entity } from '@arekrado/canvas-engine'
import { State } from '../types'
import { getMesh } from '../babylonSystems/mesh/mesh.system'

/**
 * @deprecated use Position component wheter you can
 */
export const setMeshPosition = ({
  entity,

  x,
  y,
  z,
}: {
  entity: Entity
  state: State
  x?: number
  y?: number
  z?: number
}) => {
  const mesh = getMesh(entity)

  if (mesh?.ref) {
    if (x !== undefined) mesh.ref.position.x = x
    if (y !== undefined) mesh.ref.position.y = y
    if (z !== undefined) mesh.ref.position.z = z
  }

  return mesh
}
