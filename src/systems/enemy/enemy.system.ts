import { type Enemy, gameComponent } from '../../types'
import { getStore } from '../../utils/store'

export const enemySystem = () => {
  getStore().createSystem<Enemy>({
    name: gameComponent.enemy,
    componentName: gameComponent.enemy,
    remove: ({ entity }) => {
      getStore().removeEntity(entity)
    },
  })
}
