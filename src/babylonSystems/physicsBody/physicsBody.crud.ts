import { createComponentCrud } from '@arekrado/canvas-engine'
import { type PhysicsBody, gameComponent } from '../../types'
import { getStore } from '../../utils/store'

const crud = createComponentCrud<PhysicsBody>({
getStore,
  name: gameComponent.physicsBody,
})

export const getPhysicsBody = crud.getComponent
export const createPhysicsBody = crud.createComponent
export const updatePhysicsBody = crud.updateComponent
export const removePhysicsBody = crud.removeComponent
