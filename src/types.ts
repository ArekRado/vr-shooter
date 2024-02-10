import { EmptyState, Entity, System } from '@arekrado/canvas-engine'
import {
  GroundMesh,
  Mesh,
  PhysicsMotionType,
  StandardMaterial,
} from '@babylonjs/core'
import { Vector2D } from '@arekrado/vector-2d'

// Utils
export type Vector3D = [number, number, number]

export enum gameComponent {
  // Game

  player = 'player',
  enemy = 'enemy',
  gunPointer = 'gunPointer',

  health = 'health',
  position = 'positions',
  map = 'map',
  grid = 'grid',
  unitMovingPath = 'unitMovingPath',

  syncUI = 'syncUI',
  testingUtils = 'testingUtils',
  keyboard = 'keyboard',
  mouse = 'mouse',
  gameControl = 'gameControl',

  // Babylon
  standardMaterial = 'standardMaterial',
  mesh = 'mesh',
  physicsShape = 'physicsShape',
  physicsBody = 'physicsBody',
  transformNode = 'transformNode',
}

export type Player = {}
export type Enemy = {}

// game components
export type Health = { maxHealth: number; health: number }
export type Position = {
  x: number
  /**
   * Height
   */
  y: number
  z: number
}

//
// Buildings
//

//
// Units
//

export type GameMap = {
  mesh: GroundMesh
  material: StandardMaterial
}
export type Grid = {
  blockedTiles: Map<string, Set<Entity>>
  entities: Map<string, Set<Entity>>

  walkableTiles: boolean[][]
  heightTiles: number[][]
}

export type UnitMovingPath = {}
export type GunPointer = {}

export type TerrainEditorBrush = {}
export type MapControls = {}
export type TestingUtils = {}
export type Mouse = {
  buttons: number
  position: Vector2D
  isMoving: boolean
  isButtonUp: boolean
  isButtonDown: boolean
  lastClick: {
    timestamp: number
    buttons: number
  }
  wheel: {
    deltaMode: number
    deltaX: number
    deltaY: number
    deltaZ: number
  }
}

export type KeyData = {
  // Key was released.
  isUp: boolean
  // Key was pressed.
  isDown: boolean
  // @TODO Key is held.
  isPressed: boolean
}
export type Keyboard = {
  keys: { [key: string]: KeyData | undefined }
}

export type GameControl = {
  
} 

// babylon components

export type StandardMaterialType = {
  ref?: StandardMaterial
  diffuseTextureUrl?: string
}

export type MeshType = {
  ref?: Mesh
  name: string
  url: string
  enableOnPickTrigger?: boolean
}

export type PhysicsShape = {
  type: 'ConvexHull' | 'Mesh'
}

export type PhysicsBody = {
  physicsMotionType: PhysicsMotionType
  startsAsleep: boolean
}

export type TransformNode = {
  position: {
    x: number
    y: number
    z: number
  }
}

type Components = {
  [gameComponent.player]: Map<Entity, Player>
  [gameComponent.enemy]: Map<Entity, Enemy>
  [gameComponent.health]: Map<Entity, Health>
  [gameComponent.position]: Map<Entity, Position>
  [gameComponent.map]: Map<Entity, GameMap>
  [gameComponent.grid]: Map<Entity, Grid>
  [gameComponent.unitMovingPath]: Map<Entity, UnitMovingPath>
  [gameComponent.gunPointer]: Map<Entity, GunPointer>

  // [gameComponent.syncUI]: Map<Entity, GameState>
  [gameComponent.testingUtils]: Map<Entity, TestingUtils>
  [gameComponent.keyboard]: Map<Entity, Keyboard>
  [gameComponent.mouse]: Map<Entity, Mouse>

  [gameComponent.standardMaterial]: Map<Entity, StandardMaterial>
  [gameComponent.mesh]: Map<Entity, MeshType>
  [gameComponent.physicsShape]: Map<Entity, PhysicsShape>
  [gameComponent.physicsBody]: Map<Entity, PhysicsBody>
  [gameComponent.transformNode]: Map<Entity, TransformNode>
}

type Systems = System<Components>

export type State = EmptyState<Components, Systems>
