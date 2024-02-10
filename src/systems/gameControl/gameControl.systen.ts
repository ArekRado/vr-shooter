import { ECSEvent } from '@arekrado/canvas-engine'
import { GameControl, gameComponent } from '../../types'
import { getStore } from '../../utils/store'
import { setTouchScreenControls } from './setTouchScreenControls'
import { WebXRSessionManager } from '@babylonjs/core'
import { camera, canvas, engine, scene } from '../../main'

export type GameControlActionEvent = ECSEvent<
  'gameControlActionEvent',
  GameControl
>

export const gameControlEntity = 'gameControl'

const isTouchDevice = () =>
  'ontouchstart' in window || navigator.maxTouchPoints > 0

const isMouseDevice = () => matchMedia('(pointer:fine)').matches

const isVrDevice = () =>
  WebXRSessionManager.IsSessionSupportedAsync('immersive-vr')

export const gameControlSystem = () => {
  getStore().createSystem({
    name: gameComponent.gameControl,
    componentName: gameComponent.gameControl,
    create: () => {
      if (isMouseDevice()) {
        engine.enterPointerlock()
        camera.attachControl(canvas, false)
      } else if (isTouchDevice()) {
        setTouchScreenControls()
      } else {
        isVrDevice().then(() => {
          scene.createDefaultXRExperienceAsync()
        })
      }
    },
  })
}
