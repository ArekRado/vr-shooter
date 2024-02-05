import { createComponentCrud } from '@arekrado/canvas-engine'
import { type TransformNode, gameComponent } from '../../types'
import { getStore } from '../../utils/store'

const crud = createComponentCrud<TransformNode>({
getStore,
  name: gameComponent.transformNode,
})

export const getTransformNode = crud.getComponent
export const createTransformNode = crud.createComponent
export const updateTransformNode = crud.updateComponent
export const removeTransformNode = crud.removeComponent
