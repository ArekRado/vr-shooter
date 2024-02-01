import { createStore } from '@arekrado/canvas-engine'
import {
  State,
  gameComponent,
} from '../types'

export let store: ReturnType<typeof createStore<State>> | null

export const resetStore = () => {
  store = null
}

export const getStore = () => store ?? setStore()

const setStore = () => {
  store = createStore<State>({

    [gameComponent.health]: new Map(),
    [gameComponent.position]: new Map(),
    [gameComponent.map]: new Map(),
    [gameComponent.grid]: new Map(),
    [gameComponent.unitMovingPath]: new Map(),

    // [gameComponent.syncUI]: new Map(),
    [gameComponent.testingUtils]: new Map(),

    [gameComponent.standardMaterial]: new Map(),
    [gameComponent.mesh]: new Map(),
  })

  return store
}
