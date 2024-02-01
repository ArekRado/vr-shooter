import { scene } from '../main'
import { isTestEnabled } from './isTestEnabled'

const mockedDeltaTime = parseInt(
  new URLSearchParams(window.location.search).get('deltaTime') ?? '100',
)

export const getDeltaTime = () =>
  isTestEnabled ? mockedDeltaTime : scene.deltaTime ?? 0
