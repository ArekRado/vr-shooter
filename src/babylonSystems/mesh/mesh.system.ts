import { Entity } from '@arekrado/canvas-engine'
import { type MeshType, gameComponent } from '../../types'
import { scene, viewer } from '../../main'
import {
  ActionEvent,
  ActionManager,
  ExecuteCodeAction,
  SceneLoader,
} from '@babylonjs/core'
import { getStore } from '../../utils/store'

import '@babylonjs/loaders/glTF'
import '@babylonjs/loaders/OBJ/objFileLoader';

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
  getStore().createSystem<MeshType, { onLoad: () => void }>({
    name: gameComponent.mesh,
    componentName: gameComponent.mesh,
    create: ({ entity, component, extraParameters }) => {
      const transformNode = scene.getTransformNodeByName(entity)

      if (!transformNode) {
        console.log('Can not create Mesh. TransformNode does not exist')
        return
      }

      SceneLoader.ImportMeshAsync(
        '',
        '/vr-shooter/models/',
         component.url,
        scene
      ).then((model) => {
        model.meshes.forEach((mesh, i) => {
          mesh.parent = transformNode

          if (mesh.name === '__root__') {
            mesh.metadata = { entity }
            return
          }

          mesh.name = entity
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

        extraParameters.onLoad()
      })
    },
    remove: ({ entity }) => {
      const mesh = scene.getMeshByName(entity)
      if (mesh) {
        viewer?.hideBody(mesh.physicsBody)
        mesh.dispose()
      }
    },
  })
}
