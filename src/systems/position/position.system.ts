import { type Position, gameComponent } from '../../types'
import { getStore } from '../../utils/store'

export const positionSystem = () => {
  getStore().createSystem<Position>({
    name: gameComponent.position,
    componentName: gameComponent.position,
  })
}
