import { createComponentCrud } from '@arekrado/canvas-engine'
import { type PhysicsShape, gameComponent } from '../../types'
import { getStore } from '../../utils/store'

const crud = createComponentCrud<PhysicsShape>({
getStore,
  name: gameComponent.physicsShape,
})

export const getPhysicsShape = crud.getComponent
export const createPhysicsShape = crud.createComponent
export const updatePhysicsShape = crud.updateComponent
export const removePhysicsShape = crud.removeComponent
