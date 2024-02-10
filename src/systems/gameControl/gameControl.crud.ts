import { createComponentCrud } from '@arekrado/canvas-engine'
import { type GameControl, gameComponent } from '../../types'
import { getStore } from '../../utils/store'

const crud = createComponentCrud<GameControl>({
  getStore,
  name: gameComponent.gameControl,
})

export const getGameControl = crud.getComponent
export const createGameControl = crud.createComponent
export const updateGameControl = crud.updateComponent
export const removeGameControl = crud.removeComponent
