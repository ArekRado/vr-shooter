import {
  EventState,
  PointerEventTypes,
  PointerInfo,
  Scene,
} from '@babylonjs/core'
import { ECSEvent } from '@arekrado/canvas-engine'
import { getStore } from './store';

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

      // var delta = 0
      // if (event.wheelDelta) {
      //   delta = event.wheelDelta
      // } else if (event.detail) {
      //   delta = -event.detail
      // }
      // if (delta) {
      //   var dir = scene.activeCamera.getDirection(BABYLON.Axis.Z)
      //   // console.log("dir: ", dir);
      //   if (delta > 0) {
      //     scene.activeCamera.position.addInPlace(dir)
      //     scaleU -= 0.1
      //     scaleV -= 0.1
      //     offsetX -= 0.1
      //     offsetY -= 0.1
      //   } else {
      //     scene.activeCamera.position.subtractInPlace(dir)
      //     scaleU += 0.1
      //     scaleV += 0.1
      //     offsetX += 0.1
      //     offsetY += 0.1
      //   }
      // }
      // layer.texture.uScale = scaleU
      // layer.texture.vScale = scaleV
      // layer.texture.vOffset.x = offsetX
      // layer.texture.vOffset = offsetY
    }
  })
}
