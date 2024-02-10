import { createComponentCrud } from '@arekrado/canvas-engine'
import { type Keyboard, gameComponent } from '../../types'
import { getStore } from '../../utils/store'

const crud = createComponentCrud<Keyboard>({
getStore,
  name: gameComponent.keyboard,
})

export const getKeyboard = crud.getComponent
export const createKeyboard = crud.createComponent
export const updateKeyboard = crud.updateComponent
export const removeKeyboard = crud.removeComponent