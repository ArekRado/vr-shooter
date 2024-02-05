import {
  EventState,
  PointerEventTypes,
  PointerInfo,
  Scene,
} from '@babylonjs/core'
import { ECSEvent } from '@arekrado/canvas-engine'
import { getStore } from './store'
import { engine } from '../main'

export type OnPointerMoveEvent = ECSEvent<
  'OnPointerMove',
  { pointerInfo: PointerInfo; eventState: EventState }
>
export type OnPointerDownEvent = ECSEvent<
  'OnPointerDown',
  { pointerInfo: PointerInfo; eventState: EventState }
>
export type OnPointerUpEvent = ECSEvent<
  'OnPointerUp',
  { pointerInfo: PointerInfo; eventState: EventState }
>
export type OnPointerWheelEvent = ECSEvent<
  'OnPointerWheel',
  { pointerInfo: PointerInfo; eventState: EventState }
>

export const setPointerEvents = (scene: Scene) => {
  scene.onPointerObservable.add((pointerInfo, eventState) => {
    switch (pointerInfo.type) {
      case PointerEventTypes.POINTERMOVE:
        getStore().emitEvent<OnPointerMoveEvent>({
          type: 'OnPointerMove',
          payload: {
            pointerInfo,
            eventState,
          },
        })
        break

      case PointerEventTypes.POINTERDOWN:
        if (!engine.isPointerLock) {
          engine.enterPointerlock()
        }

        getStore().emitEvent<OnPointerDownEvent>({
          type: 'OnPointerDown',
          payload: {
            pointerInfo,
            eventState,
          },
        })
        break
      case PointerEventTypes.POINTERUP:
        getStore().emitEvent<OnPointerUpEvent>({
          type: 'OnPointerUp',
          payload: {
            pointerInfo,
            eventState,
          },
        })
        break
      case PointerEventTypes.POINTERWHEEL:
        getStore().emitEvent<OnPointerWheelEvent>({
          type: 'OnPointerWheel',
          payload: {
            pointerInfo,
            eventState,
          },
        })
        break

      case PointerEventTypes.POINTERWHEEL:
        const activeCamera = scene.activeCamera

        if (activeCamera === undefined) return
    }
  })
}
