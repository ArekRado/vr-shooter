const mode =
  new URLSearchParams(window.location.search).get('test') === 'true'
    ? 'test'
    : import.meta.env.MODE

export const isTestEnabled = mode === 'test'
