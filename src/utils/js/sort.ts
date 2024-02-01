export const sort = (list: Array<any>, asc = true) =>
  [...list].sort((a, b) => (asc ? (a > b ? 1 : -1) : a > b ? -1 : 1))
