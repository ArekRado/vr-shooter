/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { vector, vectorZero } from '@arekrado/vector-2d'
import { MouseActionEvent, mouseEntity } from './mouse.system'
import { vi, describe, expect, it, beforeEach, afterEach } from 'vitest'
import { getStore, resetStore } from '../../utils/store'
import { runOneFrame } from '@arekrado/canvas-engine'
import { initializeGame } from '../../main'
import { injectEmptyGrid } from '../testingUtils/injectEmptyGrid'
import { getMouse } from './mouse.crud'

describe.skip('mouse', () => {
  let mousemoveCallback: Function
  let mouseenterCallback: Function
  let mouseleaveCallback: Function
  let mouseupCallback: Function
  let mousedownCallback: Function
  let wheelCallback: Function

  beforeEach(async () => {
    await initializeGame()
    injectEmptyGrid()

    mousemoveCallback = () => {}
    mouseenterCallback = () => {}
    mouseleaveCallback = () => {}
    mouseupCallback = () => {}
    mousedownCallback = () => {}
    wheelCallback = () => {}

    document = {
      getElementById: (() => ({
        getBoundingClientRect: (() => ({
          left: 0,
          top: 0,
        })) as Element['getBoundingClientRect'],
        addEventListener: ((
          type: keyof HTMLElementEventMap,
          callback: Function
        ) => {
          switch (type) {
            case 'mousemove':
              mousemoveCallback = callback
              break
            case 'mouseenter':
              mouseenterCallback = callback
              break
            case 'mouseleave':
              mouseleaveCallback = callback
              break
            case 'mouseup':
              mouseupCallback = callback
              break
            case 'mousedown':
              mousedownCallback = callback
              break
            case 'wheel':
              wheelCallback = callback
              break
          }
        }) as Document['addEventListener'],
      })) as unknown as Document['getElementById'],
      addEventListener: (() => {}) as Document['addEventListener'],
    } as Document
  })

  afterEach(() => {
    resetStore()
  })

  it('should set buttons on mousedown event', () => {
    let state = getStore()

    const eventHandler = vi.fn(({ state }) => state)
    getStore().addEventHandler<MouseActionEvent>(
      'mouseActionEvent',
      eventHandler
    )

    expect(getMouse(mouseEntity)?.buttons).toBe(0)

    mousedownCallback({ buttons: 1 })

    runOneFrame(getStore().getState())

    expect(getMouse(mouseEntity)?.buttons).toBe(1)

    runOneFrame(getStore().getState())

    // Next tick should reset buttons
    expect(getMouse(mouseEntity)?.buttons).toBe(0)

    expect(eventHandler.mock.calls[0][0].type).toEqual('mouseActionEvent')
    expect(eventHandler.mock.calls[0][0].payload.buttons).toEqual(1)
  })

  it('should set mouse position on mousemove event', () => {
    expect(getMouse(mouseEntity)?.position).toEqual(vectorZero())

    mousemoveCallback({ pageX: 1, pageY: 1 })

    runOneFrame(getStore().getState())

    expect(getMouse(mouseEntity)?.position).toEqual(vector(1, 1))
  })

  it('wheel', () => {
    const initialMouse = getMouse(mouseEntity)

    wheelCallback({
      deltaMode: 1,
      deltaX: 2,
      deltaY: 3,
      deltaZ: 4,
    })

    runOneFrame(getStore().getState())

    expect(getMouse(mouseEntity)?.wheel).toEqual({
      deltaMode: 1,
      deltaX: 2,
      deltaY: 3,
      deltaZ: 4,
    })

    runOneFrame(getStore().getState())

    // Next tick should reset wheel
    expect(getMouse(mouseEntity)?.wheel).toEqual(initialMouse?.wheel)
  })
})
