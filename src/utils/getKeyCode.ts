const mouse = {
  leftButton: 1,
  rightButton: 2,
  wheelButton: 4,
}

const keysMap = {
  mouseActionButton: mouse.leftButton,
  cancelActionButton: mouse.rightButton,

  duplicateConstruction: 'Shift',

  cameraMoveLeft: 'a',
  cameraMoveRight: 'd',
  cameraMoveBack: 'w',
  cameraMoveForward: 's',
  cameraMoveMouseButton: mouse.rightButton,
  cameraRotateMouseButton: mouse.wheelButton,
}

export const getKeyCode = (key: keyof typeof keysMap) => {
  return keysMap[key]
}
