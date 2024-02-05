declare module '*.jpg'
declare module '*.png'
declare module '*.obj'
declare module '*.glb'
declare module '*.babylon'

declare module '*.css'

interface ImportMeta {
  readonly env: {
    MODE: 'development' | 'test' | 'production'
  }
}

interface Window {
  state: State
  eventsCache: { type: string; payload: any }[]
}
