import { isTestEnabled } from './isTestEnabled'

export const getRandomDelay = (time = 1500) =>
  isTestEnabled ? 0 : Math.random() * time
