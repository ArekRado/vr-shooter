import { runOneFrame } from '@arekrado/canvas-engine'
import { getStore } from '../../utils/store'

export const tick = () => {
  window.eventsCache = []
  runOneFrame(getStore().getState())
}

export const tickUntilGameStart = () =>
  tickUntil(() => {
    const event = findEvent('generateGridFromMapFinished')
    return !!event
  })

export const tickUntil = async (
  check: () => boolean | Promise<boolean>,
  options?: Partial<{
    maxTicks: number
  }>
): Promise<void> => {
  const maxTicks = options?.maxTicks ?? 10

  for (let i = 0; i < maxTicks; i++) {
    tick()

    const response = await check()

    if (response) {
      return
    }
  }

  throw new Error(`Couldn't tick until`)
}

export const waitTime = (time: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(null)
    }, time)
  })

export const findEvent = (eventType: string) => {
  const newEvent = window.eventsCache.find((event) => event.type === eventType)

  return newEvent
}

export const waitForEvent = async (eventType: string) => {
  for (let i = 0; i < 10; i++) {
    const event = findEvent(eventType)

    if (event) {
      return event
    } else {
      await waitTime(2)
    }
  }

  throw new Error(`Couldn't find event ${eventType}`)
}
