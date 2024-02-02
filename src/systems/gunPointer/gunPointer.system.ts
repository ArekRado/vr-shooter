import { GunPointer, gameComponent } from '../../types'
import { getStore } from '../../utils/store'

export const gunPointerSystem = () => {
  getStore().createSystem<GunPointer>({
    name: gameComponent.gunPointer,
    componentName: gameComponent.gunPointer,
    create: () => {
      console.log('create')
      const gunPointer = document.getElementById('gunPointer')
      if (gunPointer) {
        gunPointer.style['display'] = 'absolute'
      }
    },
    remove: () => {
      const gunPointer = document.getElementById('gunPointer')
      if (gunPointer) {
        gunPointer.style['display'] = 'none'
      }
    },
  })
}
