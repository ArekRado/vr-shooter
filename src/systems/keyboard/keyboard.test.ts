/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
import { runOneFrame } from '@arekrado/canvas-engine'
import { getStore } from '../../utils/store'
import { getKeyboard } from './keyboard.crud'
import { KeyboardActionEvent, keyboardEntity } from './keyboard.systen'
import { describe, it, beforeEach, expect, vi } from 'vitest'

describe.skip('keyboard', () => {
  let keyupCallback: Function
  let keydownCallback: Function

  beforeEach(() => {
    keyupCallback = () => {}
    keydownCallback = () => {}

    document = {
      getElementById: (() => ({
        getBoundingClientRect: (() => ({
          left: 0,
          top: 0,
        })) as Element['getBoundingClientRect'],
        addEventListener: (() => {}) as Document['addEventListener'],
      })) as unknown as Document['getElementById'],
      addEventListener: ((
        type: keyof HTMLElementEventMap,
        callback: Function
      ) => {
        switch (type) {
          case 'keyup':
            keyupCallback = callback
            break
          case 'keydown':
            keydownCallback = callback
            break
        }
      }) as Document['addEventListener'],
    } as Document
  })

  it('should set keyboard isUp and isDown flags', () => {
    const key1 = 'a'
    const key2 = 'b'

    const eventHandler = vi.fn(({ state }) => state)
    getStore().addEventHandler<KeyboardActionEvent>(
      'keyboardActionEvent',
      eventHandler
    )

    expect(getKeyboard(keyboardEntity)?.keys[key1]).toBeUndefined()

    keydownCallback({ key: key1 })

    runOneFrame(getStore().getState())

    expect(getKeyboard(keyboardEntity)?.keys[key1]).toEqual({
      isDown: true,
      isUp: false,
      isPressed: true,
    })

    keydownCallback({ key: key2 })

    runOneFrame(getStore().getState())

    // runOneFrame should reset isDown
    expect(getKeyboard(keyboardEntity)?.keys[key1]).toEqual({
      isDown: false,
      isUp: false,
      isPressed: true,
    })
    expect(getKeyboard(keyboardEntity)?.keys[key2]).toEqual({
      isDown: true,
      isUp: false,
      isPressed: true,
    })

    keyupCallback({ key: key1 })

    runOneFrame(getStore().getState())

    expect(getKeyboard(keyboardEntity)?.keys[key1]).toEqual({
      isDown: false,
      isUp: true,
      isPressed: false,
    })

    expect(eventHandler.mock.calls[0][0].type).toEqual('keyboardActionEvent')

    expect(eventHandler.mock.calls[0][0].payload.keys[key1]).toEqual({
      isDown: true,
      isPressed: true,
      isUp: false,
    })
  })
})
