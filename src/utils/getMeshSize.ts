export const getMeshSize = ({
  width,
  height,
}: {
  width: number
  height: number
}): {
  width: number
  height: number
} => ({
  width: width / 10,
  height: height / 10,
})
