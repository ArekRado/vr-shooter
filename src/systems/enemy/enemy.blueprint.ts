import { Entity } from '@arekrado/canvas-engine'
import { createEnemy } from './ememy.crud'
import { Enemy, Health, Position } from '../../types'
import { createMesh } from '../../babylonSystems/mesh/mesh.system'
import { createPosition } from '../position/position.crud'
import { createHealth } from '../health.crud'
import { createStandardMaterial } from '../../babylonSystems/standardMaterial/standardMaterial.crud'

import recruitUrl from '../../assets/units/recruit.png'

export const enemyBlueprint = ({
  entity,
  enemy,
  position,
  health,
}: {
  entity: Entity
  enemy?: Partial<Enemy>
  position: Position
  health?: Partial<Health>
}) => {
  createEnemy(entity, enemy ?? {})
  createStandardMaterial(entity, {
    ref: undefined,
    diffuseTextureUrl: recruitUrl,
  })
  createMesh(entity, {
    ref: undefined,
    enableOnPickTrigger: true,
    name: entity,
  })
  createPosition(entity, position)
  createHealth(entity, {
    health: health?.health ?? 1,
    maxHealth: health?.maxHealth ?? 1,
  })
}
