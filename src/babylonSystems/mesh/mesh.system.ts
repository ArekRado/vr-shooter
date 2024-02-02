import { Entity, createComponentCrud } from '@arekrado/canvas-engine'
import { type MeshType, gameComponent } from '../../types'
import { scene } from '../../main'
import {
  ActionEvent,
  ActionManager,
  ExecuteCodeAction,
  Mesh,
  MeshBuilder,
} from '@babylonjs/core'
import { getStore } from '../../utils/store'
import { getStandardMaterial } from '../standardMaterial/standardMaterial.crud'

const crud = createComponentCrud<MeshType>({
  getStore,
  name: gameComponent.mesh,
})

export const getMesh = crud.getComponent
export const createMesh = crud.createComponent
export const updateMesh = crud.updateComponent
export const removeMesh = crud.removeComponent

export enum MeshEventType {
  OnPickTrigger = 'OnPickTrigger',
}

export type OnPickTriggerEvent = {
  type: MeshEventType.OnPickTrigger
  payload: {
    entity: Entity
    actionEvent: ActionEvent
  }
}

export type MeshEvents = OnPickTriggerEvent

export const meshSystem = () => {
  getStore().createSystem<MeshType>({
    name: gameComponent.mesh,
    componentName: gameComponent.mesh,
    create: ({ entity, component }) => {
      component.ref = MeshBuilder.CreateTiledBox(component.name ?? entity, {
        sideOrientation: Mesh.DOUBLESIDE,
        pattern: Mesh.FLIP_TILE,
        alignVertical: Mesh.TOP,
        alignHorizontal: Mesh.LEFT,
      })

      component.ref.metadata = { entity }

      const standardMaterial = getStandardMaterial(entity)

      if (standardMaterial && standardMaterial.ref) {
        component.ref.material = standardMaterial.ref
      }

      if (component.enableOnPickTrigger) {
        component.ref.actionManager = new ActionManager(scene)
        component.ref.actionManager.registerAction(
          new ExecuteCodeAction(ActionManager.OnPickTrigger, (actionEvent) => {
            getStore().emitEvent<OnPickTriggerEvent>({
              type: MeshEventType.OnPickTrigger,
              payload: {
                entity,
                actionEvent,
              },
            })
          })
        )
      }

      component.ref.position.x = 0
      component.ref.position.y = 0
      component.ref.position.z = 0
    },
    remove: ({ component }) => {
      component.ref?.dispose()
    },
  })
}
