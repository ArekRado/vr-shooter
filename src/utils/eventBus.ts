export const eventBusOn = <Actions>(callback: (data: Actions) => void) => {
  document.addEventListener('game', (e: Event) => callback((e as any).detail))
}

export const eventBusDispatch = <Actions>(action: Actions) => {
  document.dispatchEvent(new CustomEvent('game', { detail: action }))
}

export const eventBusRemove = (
  callback: Parameters<typeof document.removeEventListener>[1]
) => {
  document.removeEventListener('game', callback)
}
