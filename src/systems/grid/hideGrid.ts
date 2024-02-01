import { gridMesh } from './showGrid'

export const hideGrid = () => {
  gridMesh?.dispose(true, true)
}
