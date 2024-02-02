import { createComponentCrud } from '@arekrado/canvas-engine'
import { gameComponent, GunPointer } from '../../types'
import { getStore } from '../../utils/store'

const crud = createComponentCrud<GunPointer>({
  getStore,
  name: gameComponent.gunPointer,
})

export const getGunPointer = crud.getComponent
export const createGunPointer = crud.createComponent
export const updateGunPointer = crud.updateComponent
export const removeGunPointer = crud.removeComponent
