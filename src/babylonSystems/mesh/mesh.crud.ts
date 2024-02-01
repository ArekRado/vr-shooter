import { createComponentCrud } from '@arekrado/canvas-engine'
import { type MeshType, gameComponent } from '../../types'
import { getStore } from '../../utils/store'

const crud = createComponentCrud<MeshType>({
getStore,
  name: gameComponent.mesh,
})

export const getMesh = crud.getComponent
export const createMesh = crud.createComponent
export const updateMesh = crud.updateComponent
export const removeMesh = crud.removeComponent
