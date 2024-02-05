import { Entity, createComponentCrud } from '@arekrado/canvas-engine'
import { type Position, gameComponent } from '../../types'
import { getStore } from '../../utils/store'
import { getMesh } from '../../babylonSystems/mesh/mesh.crud'

const crud = createComponentCrud<Position>({
getStore,
  name: gameComponent.position,
})

export const getPosition = crud.getComponent
export const createPosition = (entity: Entity, data: Position) => {
  crud.createComponent(entity, data)

  const position = getPosition(entity)
  const mesh = getMesh(entity)

  if (mesh?.ref) {
    if (position?.x !== undefined) mesh.ref.position.x = position.x
    if (position?.y !== undefined) mesh.ref.position.y = position.y
    if (position?.z !== undefined) mesh.ref.position.z = position.z
  }
}

export const updatePosition = (
  entity: Entity,
  update: (component: Position) => Partial<Position>
) => {
  crud.updateComponent(entity, update)

  const position = getPosition(entity)
  const mesh = getMesh(entity)

  if (mesh?.ref) {
    if (position?.x !== undefined) mesh.ref.position.x = position.x
    if (position?.y !== undefined) mesh.ref.position.y = position.y
    if (position?.z !== undefined) mesh.ref.position.z = position.z
  }
}
export const removePosition = crud.removeComponent
