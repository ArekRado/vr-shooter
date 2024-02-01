import { createComponentCrud } from '@arekrado/canvas-engine'
import { TestingUtils, gameComponent } from '../../types'
import { getStore } from '../../utils/store'

const crud = createComponentCrud<TestingUtils>({
getStore,
  name: gameComponent.testingUtils,
})

export const getTestingUtils = crud.getComponent
export const createTestingUtils = crud.createComponent
export const updateTestingUtils = crud.updateComponent
export const removeTestingUtils = crud.removeComponent
