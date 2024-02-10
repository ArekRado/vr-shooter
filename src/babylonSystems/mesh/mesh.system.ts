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
import { getPosition } from '../../systems/position/position.crud'

import '@babylonjs/loaders/glTF'

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

      const position = getPosition(entity)

      transformNode.position.x = position?.x ?? 0
      transformNode.position.y = position?.y ?? 0
      transformNode.position.z = position?.z ?? 0

      SceneLoader.ImportMeshAsync(
        '',
        '/',
        component.url.substring(1),
        scene
      ).then((model) => {
        model.meshes.forEach((mesh, i) => {
          if (mesh.name === '__root__') {
            mesh.parent = transformNode
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
