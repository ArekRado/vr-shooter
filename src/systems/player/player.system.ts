import { type Player, gameComponent } from '../../types'
import { getStore } from '../../utils/store'

export const playerSystem = () => {
  getStore().createSystem<Player>({
    name: gameComponent.player,
    componentName: gameComponent.player,
  })
}
