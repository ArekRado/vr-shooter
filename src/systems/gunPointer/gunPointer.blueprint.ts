import { Entity } from '@arekrado/canvas-engine'
import { createGunPointer } from './gunPointer.crud'

export const gunPointerBlueprint = ({ entity }: { entity: Entity }) => {
  createGunPointer(entity, {})
}
