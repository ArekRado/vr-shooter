import { createComponentCrud } from '@arekrado/canvas-engine'
import { type GameMap, gameComponent } from '../../types'
import { getStore } from '../../utils/store'

const crud = createComponentCrud<GameMap>({ getStore, name: gameComponent.map })

export const getMap = crud.getComponent
export const createMap = crud.createComponent
export const updateMap = crud.updateComponent
export const removeMap = crud.removeComponent
