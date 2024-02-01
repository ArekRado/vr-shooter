import { createComponentCrud } from '@arekrado/canvas-engine'
import { type StandardMaterialType, gameComponent } from '../../types'
import { getStore } from '../../utils/store'

const crud = createComponentCrud<StandardMaterialType>({
getStore,
  name: gameComponent.standardMaterial,
})

export const getStandardMaterial = crud.getComponent
export const createStandardMaterial = crud.createComponent
export const updateStandardMaterial = crud.updateComponent
export const removeStandardMaterial = crud.removeComponent
