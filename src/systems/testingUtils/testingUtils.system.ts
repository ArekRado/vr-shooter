import { ECSEvent, Entity, generateEntity } from '@arekrado/canvas-engine'
import { createTestingUtils } from './testingUtils.crud'
import { getStore, resetStore } from '../../utils/store'

export const testingUtilsEntity = generateEntity()

export type AskForSyncUIEvent = ECSEvent<
  'askForSyncUI',
  { buildingEntity?: Entity; unitEntity?: Entity }
>

export const testingUtilsSystem = () => {
  createTestingUtils(testingUtilsEntity, {})

  window.eventsCache = []
  ;['generateGridFromMapFinished'].forEach((eventType) => {
    getStore().addEventHandler(eventType, (event) => {
      window.eventsCache.push(event)
    })
  })

  getStore().createSystem({
    name: 'testingUtils',
    componentName: testingUtilsEntity,
  })
}
