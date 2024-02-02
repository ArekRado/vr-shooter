import { vector, vectorZero } from '@arekrado/vector-2d'
import { getStore } from '../../utils/store'
import { Mouse, gameComponent } from '../../types'
import { ECSEvent } from '@arekrado/canvas-engine'
import { createMouse, updateMouse } from './mouse.crud'

export type MouseActionEvent = ECSEvent<'mouseActionEvent', Mouse>

export const mouseEntity = 'mouse'

let shouldEmitEvent = false

let buttons = 0
let position = vectorZero()
let lastClick = {
  timestamp: -1,
  buttons: 0,
}
let isMoving = false
let isButtonUp = false
let isButtonDown = false

let wheel = {
  deltaMode: 0,
  deltaX: 0,
  deltaY: 0,
  deltaZ: 0,
}

export const mouseSystem = ({
  containerId,
  document,
}: {
  document: Document
  containerId: string
}) => {
  const container = document.getElementById(containerId)

  if (container) {
    const containerPosition = container.getBoundingClientRect()

    const setMousePosition = (e: MouseEvent) => {
      shouldEmitEvent = false

      position = vector(
        e.pageX - containerPosition.left,
        e.pageY - containerPosition.top
      )
    }

    container.addEventListener(
      'mousemove',
      (e: MouseEvent) => {
        setMousePosition(e)
        isMoving = true
      },
      false
    )
    container.addEventListener('mouseenter', setMousePosition, false)
    container.addEventListener('mouseleave', setMousePosition, false)

    container.addEventListener(
      'mouseup',
      () => {
        console.log('mouseup')
        shouldEmitEvent = true

        isButtonUp = true
      },
      false
    )
    container.addEventListener(
      'mousedown',
      (e) => {
        shouldEmitEvent = true

        isButtonDown = true

        buttons = e.buttons
        lastClick = {
          timestamp: Date.now(),
          buttons: e.buttons,
        }
      },
      false
    )
    container.addEventListener('wheel', (e) => {
      shouldEmitEvent = true

      wheel = {
        deltaMode: e.deltaMode,
        deltaX: e.deltaX,
        deltaY: e.deltaY,
        deltaZ: e.deltaZ,
      }
    })
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Couldnt find container to attach mouse events')
    }
  }

  getStore().createEntity(mouseEntity)

  createMouse(mouseEntity, {
    buttons: 0,
    position: [0, 0],
    isButtonUp: false,
    isButtonDown: false,
    isMoving: false,
    lastClick: {
      timestamp: -1,
      buttons: 0,
    },
    wheel: {
      deltaMode: 0,
      deltaX: 0,
      deltaY: 0,
      deltaZ: 0,
    },
  })

  getStore().createSystem({
    name: gameComponent.mouse,
    componentName: gameComponent.mouse,
    priority: -1,
    tick: ({ entity }) => {
      const mouseBeforeReset: Mouse = {
        buttons,
        position,
        lastClick,
        isButtonUp,
        isButtonDown,
        isMoving,
        wheel: { ...wheel },
      }

      buttons = 0
      isButtonUp = false
      isButtonDown = false
      isMoving = false
      wheel = {
        deltaMode: 0,
        deltaX: 0,
        deltaY: 0,
        deltaZ: 0,
      }

      updateMouse(entity, () => mouseBeforeReset)

      if (shouldEmitEvent === true) {
        shouldEmitEvent = false

        getStore().emitEvent<MouseActionEvent>({
          type: 'mouseActionEvent',
          payload: mouseBeforeReset,
        })
      }
    },
  })
}
