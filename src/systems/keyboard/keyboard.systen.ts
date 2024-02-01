import { ECSEvent } from '@arekrado/canvas-engine'
import { Keyboard, gameComponent } from '../../types'
import { getStore } from '../../utils/store'
import { createKeyboard, updateKeyboard } from './keyboard.crud'

export type KeyboardActionEvent = ECSEvent<'keyboardActionEvent', Keyboard>

export const keyboardEntity = 'keyboard'

let shouldEmitEvent = false

let keyboard: Keyboard = {
  keys: {},
}

export const keyboardSystem = ({
  containerId,
  document,
}: {
  document: Document
  containerId: string
}) => {
  const container = document.getElementById(containerId)

  if (container) {
    document.addEventListener(
      'keydown',
      (e) => {
        shouldEmitEvent = true

        keyboard.keys[e.key] = {
          isDown: true,
          isUp: false,
          isPressed: true,
        }
      },
      false
    )
    document.addEventListener(
      'keyup',
      (e) => {
        shouldEmitEvent = true

        keyboard.keys[e.key] = {
          isDown: false,
          isUp: true,
          isPressed: false,
        }
      },
      false
    )
  }

  getStore().createEntity(keyboardEntity)

  createKeyboard(keyboardEntity, {
    keys: {},
  })

  getStore().createSystem({
    name: gameComponent.keyboard,
    componentName: gameComponent.keyboard,
    priority: -1,
    tick: ({ entity }) => {
      const keyboardBeforeReset = {
        keys: keyboard.keys,
      }

      keyboard = {
        keys: Object.entries(keyboard.keys).reduce((acc, [key, value]) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          acc[key] = {
            isDown: false,
            isUp: false,
            isPressed: value?.isPressed ?? false,
          }

          return acc
        }, {}),
      }

      updateKeyboard(entity, () => keyboardBeforeReset)

      if (shouldEmitEvent === true) {
        shouldEmitEvent = false

        getStore().emitEvent({
          type: 'keyboardActionEvent',
          payload: keyboardBeforeReset,
        })
      }
    },
  })
}
