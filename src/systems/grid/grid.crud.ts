import { createComponentCrud } from '@arekrado/canvas-engine'
import { type Grid, gameComponent } from '../../types'
import { getStore } from '../../utils/store'

const crud = createComponentCrud<Grid>({ getStore, name: gameComponent.grid })

export const getGrid = crud.getComponent
export const createGrid = crud.createComponent
export const updateGrid = crud.updateComponent
export const removeGrid = crud.removeComponent
