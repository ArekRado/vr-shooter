import { createComponentCrud } from '@arekrado/canvas-engine'
import { gameComponent, Enemy } from '../../types'
import { getStore } from '../../utils/store'

const crud = createComponentCrud<Enemy>({ getStore, name: gameComponent.enemy })

export const getEnemy = crud.getComponent
export const createEnemy = crud.createComponent
export const updateEnemy = crud.updateComponent
export const removeEnemy = crud.removeComponent
