import { Entity, createComponentCrud } from '@arekrado/canvas-engine'
import { type MeshType, gameComponent } from '../../types'
import { scene } from '../../main'
import {
  ActionEvent,
  ActionManager,
  ExecuteCodeAction,
  Mesh,
  MeshBuilder,
  SceneLoader,
  TransformNode,
} from '@babylonjs/core'
import { getStore } from '../../utils/store'
import { getStandardMaterial } from '../standardMaterial/standardMaterial.crud'

import '@babylonjs/loaders/glTF'
import { getPosition } from '../../systems/position/position.crud'

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
      const transformNode = new TransformNode(entity)

      SceneLoader.ImportMeshAsync(
        '',
        '/',
        component.url.substring(1),
        scene
      ).then((model) => {

        model.meshes.forEach((mesh) => {
          mesh.parent = transformNode

          mesh.metadata = { entity }

          if (component.enableOnPickTrigger) {
            mesh.actionManager = new ActionManager(scene)
            mesh.actionManager.registerAction(
              new ExecuteCodeAction(
                ActionManager.OnPickTrigger,
                (actionEvent) => {
                  getStore().emitEvent<OnPickTriggerEvent>({
                    type: MeshEventType.OnPickTrigger,
                    payload: {
                      entity,
                      actionEvent,
                    },
                  })
                }
              )
            )
          }
        })
      })

      const position = getPosition(entity)

      transformNode.position.x = position?.x ?? 0
      transformNode.position.y = position?.y ?? 0
      transformNode.position.z = position?.z ?? 0
    },
    remove: ({ component }) => {
      component.ref?.dispose()
    },
  })
}
