import {
  Color3,
  Engine,
  HemisphericLight,
  Scene,
  Vector3,
  ScenePerformancePriority,
  NullEngine,
  Logger,
  FreeCamera,
  HavokPlugin,
} from '@babylonjs/core'
import HavokPhysics from '@babylonjs/havok'

import { generateEntity, runOneFrame } from '@arekrado/canvas-engine'
import { meshSystem } from './babylonSystems/mesh/mesh.system.ts'
import { standardMaterialSystem } from './babylonSystems/standardMaterial/standardMaterial.system.ts'
import { State } from './types'
import { setPointerEvents } from './utils/pointerEvents.ts'

import { mapBlueprint } from './systems/map/map.blueprint.ts'
import { skyboxBlueprint } from './systems/skybox/skybox.blueprint.ts'
import { isTestEnabled } from './utils/isTestEnabled.ts'

import './index.d.ts'
import { getStore } from './utils/store.ts'
import { gridSystem } from './systems/grid/grid.system.ts'
import { mouseSystem } from './systems/mouse/mouse.system.ts'
import { keyboardSystem } from './systems/keyboard/keyboard.systen.ts'
import { playerSystem } from './systems/player/player.system.ts'
import { enemySystem } from './systems/enemy/enemy.system.ts'
import { enemyBlueprint } from './systems/enemy/enemy.blueprint.ts'
import { gunPointerBlueprint } from './systems/gunPointer/gunPointer.blueprint.ts'
import { gunPointerSystem } from './systems/gunPointer/gunPointer.system.ts'
import { physicsShapeSystem } from './babylonSystems/physicsShape/physicsShape.system.ts'
import { physicsBodySystem } from './babylonSystems/physicsBody/physicsBody.system.ts'
import { transformNodeSystem } from './babylonSystems/transformNode/transformNode.system.ts'

export const canvasId = 'game'

if (isTestEnabled) {
  Logger.Log = () => {}
}

const injectInitialState = () => {
  const gunPointerEntity = generateEntity()
  getStore().createEntity(gunPointerEntity)
  gunPointerBlueprint({ entity: gunPointerEntity })

  Array.from({ length: 5 }).forEach(() => {
    const entity = generateEntity()
    getStore().createEntity(entity)

    enemyBlueprint({
      entity,
      position: {
        x: Math.random() * 20,
        y: 0,
        z: Math.random() * 20,
      },
    })
  })
}

export let engine: Engine
export let scene: Scene
export let camera: FreeCamera

const initializeBabylon = async () => {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement

  if (!canvas && !isTestEnabled) {
    throw new Error(`Cant fird element with id ${canvasId}`)
  }

  // Engine
  engine = isTestEnabled ? new NullEngine() : new Engine(canvas)
  engine.enterPointerlock()
  scene = new Scene(engine)

  scene.performancePriority = ScenePerformancePriority.BackwardCompatible

  const gravityVector = new Vector3(0, -9.81, 0)
  const havokInstance = await HavokPhysics()
  const physicsPlugin = new HavokPlugin(true, havokInstance)
  scene.enablePhysics(gravityVector, physicsPlugin)

  setPointerEvents(scene)

  // if (!isTestEnabled) {
  import('@babylonjs/inspector').then(({ Inspector }) => {
    Inspector.Show(scene, {
      embedMode: true,
    })
  })
  // }
  // scene.gravity = new Vector3(0, -0.9, 0)
  // scene.collisionsEnabled = true

  camera = new FreeCamera('FreeCamera', new Vector3(8, 8, 16), scene)

  camera.attachControl(canvas, false)
  // scene.collisionsEnabled = true
  camera.checkCollisions = true
  camera.applyGravity = true
  camera.ellipsoid = new Vector3(1, 1, 1)

  // camera.mode = Camera.PERSPECTIVE_CAMERA
  // camera.minZ = 0.3

  // camera.setTarget(new Vector3(60, -3.7, 68))

  const globalLight = new HemisphericLight(
    'globalLight',
    new Vector3(1, 1, -1),
    scene
  )
  globalLight.intensity = 1
  globalLight.diffuse = new Color3(0.8, 0.8, 0.8)
  globalLight.specular = new Color3(0.05, 0.05, 0.05)
  globalLight.groundColor = new Color3(0, 0, 0)
}

const initializeState = async (): Promise<void> => {
  if (isTestEnabled) {
    const { testingUtilsSystem } = await import(
      './systems/testingUtils/testingUtils.system.ts'
    )
    testingUtilsSystem()
  }

  meshSystem()
  standardMaterialSystem()
  transformNodeSystem()
  physicsBodySystem()
  physicsShapeSystem()

  gridSystem()

  mouseSystem({
    document: document,
    containerId: canvasId,
  })
  keyboardSystem({
    document: document,
    containerId: canvasId,
  })

  mapBlueprint()
  skyboxBlueprint()

  playerSystem()
  enemySystem()

  gunPointerSystem()
}

export const initializeGame = async () => {
  await initializeBabylon()
  await initializeState()

  document.getElementById('loader')?.remove()

  if (isTestEnabled === false) {
    injectInitialState()
    document.getElementById('loader')?.remove()

    engine.runRenderLoop(() => {
      scene.render()
      runOneFrame<State>(getStore().getState())
    })
  }
}

if (isTestEnabled === false) {
  // import('./ui/main')
  document.getElementById('loader')?.remove()

  initializeGame()
}

// TODO
// water - https://forum.babylonjs.com/t/simple-stylized-water-shader/17672/14
// water - https://doc.babylonjs.com/toolsAndResources/assetLibraries/materialsLibrary/waterMat
// optimization - https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene
// reuse textures when creates units/buildings
