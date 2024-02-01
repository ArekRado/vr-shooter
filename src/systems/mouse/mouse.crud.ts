import { createComponentCrud } from '@arekrado/canvas-engine'
import { type Mouse, gameComponent } from '../../types'
import { getStore } from '../../utils/store'

const crud = createComponentCrud<Mouse>({
getStore,
  name: gameComponent.keyboard,
})

export const getMouse = crud.getComponent
export const createMouse = crud.createComponent
export const updateMouse = crud.updateComponent
export const removeMouse = crud.removeComponent
