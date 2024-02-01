import { Entity } from '@arekrado/canvas-engine'
import { gameComponent } from '../types'
import { getStore } from './store'

export const getAllEntityComponents = (entity: Entity) => {
  const state = getStore().getState()
  return Object.keys(state.component).reduce((acc, componentName: string) => {
    const component = getStore().getComponent(componentName, entity)

    if (component) {
      if (
        componentName === gameComponent.mesh ||
        componentName === gameComponent.standardMaterial
      ) {
        return {
          ...acc,
          [componentName]: componentName,
        } as Record<string, string>
      }

      return {
        ...acc,
        [componentName]: component,
      } as Record<string, string>
    }

    return acc
  }, {} as Record<string, string>)
}
