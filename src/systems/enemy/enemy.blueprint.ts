import { Entity } from '@arekrado/canvas-engine'
import { createEnemy } from './ememy.crud'
import { Enemy, Health, Position } from '../../types'
import { createHealth } from '../health.crud'

import characterUrl from '../../assets/models/character.glb'
import { createPhysicsBody } from '../../babylonSystems/physicsBody/physicsBody.crud'
import { createPhysicsShape } from '../../babylonSystems/physicsShape/physicsShape.crud'
import { PhysicsMotionType } from '@babylonjs/core'
import { createMesh } from '../../babylonSystems/mesh/mesh.crud'
import { createTransformNode } from '../../babylonSystems/transformNode/transformNode.crud'

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
  createTransformNode(entity, { position })
  createHealth(entity, {
    health: health?.health ?? 1,
    maxHealth: health?.maxHealth ?? 1,
  })

  createMesh(
    entity,
    {
      enableOnPickTrigger: false,
      name: entity,
      url: 'character.glb',
    },
    {
      onLoad: () => {
        createPhysicsBody(entity, {
          physicsMotionType: PhysicsMotionType.DYNAMIC,
          startsAsleep: false,
        })
        createPhysicsShape(entity, { type: 'ConvexHull' })
      },
    }
  )

  createEnemy(entity, enemy ?? {})
}
