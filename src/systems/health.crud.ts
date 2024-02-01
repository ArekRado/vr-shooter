import { createComponentCrud } from '@arekrado/canvas-engine'
import { type Health, gameComponent } from '../types'
import { getStore } from '../utils/store'

const crud = createComponentCrud<Health>({
getStore,
  name: gameComponent.health,
})

export const getHealth = crud.getComponent
export const createHealth = crud.createComponent
export const updateHealth = crud.updateComponent
export const removeHealth = crud.removeComponent
