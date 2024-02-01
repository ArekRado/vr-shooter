export const shuffle = <X>(list: X[]) =>
  list.concat([]).sort(() => (Math.random() > 0.5 ? 1 : -1))
