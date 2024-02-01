export const removeDuplicates = <X>(list: X[]): X[] => {
  const uniqueList = [...new Set(list)]
  return Array.from(uniqueList)
}
